import Capacitor
import CoreMotion
import Foundation

@objc(DeviceOrientation)
public class DeviceOrientation: CAPPlugin {
    private var motionManager = CMMotionManager()
    private var watchingCalls: [String: CAPPluginCall] = [:]

    // Helper to convert frequency string to TimeInterval
    private func getUpdateInterval(from frequency: String) -> TimeInterval {
        switch frequency {
        case "fast":
            return 1.0 / 200.0 // 200Hz
        case "medium":
            return 1.0 / 100.0 // 100Hz
        default: // "default"
            return 1.0 / 50.0 // 50Hz
        }
    }

    // Helper to convert radians to degrees
    private func toDegrees(_ radians: Double) -> Double {
        return 180.0 / .pi * radians
    }

    @objc func watchOrientation(_ call: CAPPluginCall) {
        guard let watchId = call.callbackId else {
            call.reject("Cannot watch orientation without a valid callback ID.")
            return
        }

        call.keepAlive = true
        watchingCalls[watchId] = call

        if watchingCalls.count == 1 {
            startMotionUpdates(for: call)
        }
    }

    private func startMotionUpdates(for call: CAPPluginCall) {
        if !motionManager.isDeviceMotionAvailable {
            let errorMessage = "Device motion is not available."
            for (_, savedCall) in watchingCalls {
                savedCall.reject(errorMessage)
                bridge?.releaseCall(savedCall)
            }
            watchingCalls.removeAll()
            return
        }

        let frequency = call.getString("frequency", "default")
        motionManager.deviceMotionUpdateInterval = getUpdateInterval(from: frequency)

        motionManager.startDeviceMotionUpdates(using: .xMagneticNorthZVertical, to: .main) { [weak self] motion, error in
            guard let self = self else { return }
            if let error = error {
                for (_, savedCall) in self.watchingCalls {
                    savedCall.reject("Failed to start device motion updates.", nil, error)
                    self.bridge?.releaseCall(savedCall)
                }
                self.watchingCalls.removeAll()
                self.stopMotionUpdates()
                return
            }
            guard let motion = motion else { return }

            let attitude = motion.attitude
            let quaternion = attitude.quaternion
            let azimuthDegrees = self.toDegrees(attitude.yaw)
            let normalizedAzimuth = azimuthDegrees < 0 ? azimuthDegrees + 360 : azimuthDegrees

            let data: [String: Any] = [
                "attitude": [
                    "quaternion": [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
                ],
                "orientation": [
                    "azimuth": normalizedAzimuth,
                    "pitch": self.toDegrees(attitude.pitch),
                    "roll": self.toDegrees(attitude.roll),
                ],
            ]
            for (_, savedCall) in self.watchingCalls {
                savedCall.resolve(data)
            }
        }
    }

    @objc func clearWatch(_ call: CAPPluginCall) {
        guard let watchId = call.getString("id") else {
            call.reject("Watch ID must be provided.")
            return
        }

        if let savedCall = watchingCalls.removeValue(forKey: watchId) {
            bridge?.releaseCall(savedCall)
        } else {
            call.reject("Watch ID not found.")
            return
        }

        if watchingCalls.isEmpty {
            stopMotionUpdates()
        }
        call.resolve()
    }

    private func stopMotionUpdates() {
        motionManager.stopDeviceMotionUpdates()
    }

    deinit {
        stopMotionUpdates()
        for (_, call) in watchingCalls {
            bridge?.releaseCall(call)
        }
    }
}

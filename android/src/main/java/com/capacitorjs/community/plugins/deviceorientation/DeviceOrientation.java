package com.capacitorjs.community.plugins.deviceorientation;

import android.content.Context;
import android.hardware.SensorManager;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.android.gms.location.FusedOrientationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.DeviceOrientationListener;
import com.google.android.gms.location.DeviceOrientationRequest;

import java.util.concurrent.Executor;

public class DeviceOrientation {
    private static final String TAG = "DeviceOrientation";

    private final FusedOrientationProviderClient fusedOrientationProviderClient;

    public DeviceOrientation(Context context) {
        fusedOrientationProviderClient = LocationServices.getFusedOrientationProviderClient(context);
    }

    public void watchOrientation(long samplingPeriodMicros, DeviceOrientationListener listener, Executor executor,
            PluginCall call) {
        DeviceOrientationRequest orientationRequest = new DeviceOrientationRequest.Builder(samplingPeriodMicros)
                .build();
        fusedOrientationProviderClient
                .requestOrientationUpdates(orientationRequest, executor, listener)
                .addOnSuccessListener(
                        aVoid -> Log.i(TAG, "Successfully added new orientation listener"))
                .addOnFailureListener(
                        e -> {
                            Log.e(TAG, "Failed to add new orientation listener", e);
                            call.reject(
                                    DeviceOrientationErrors.LISTENER_START_FAILED.message,
                                    DeviceOrientationErrors.LISTENER_START_FAILED.code,
                                    e);
                        });
    }

    public void clearWatch(DeviceOrientationListener listener) {
        fusedOrientationProviderClient.removeOrientationUpdates(listener);
    }

    public static JSObject getOrientationJSObject(com.google.android.gms.location.DeviceOrientation deviceOrientation) {
        JSObject data = new JSObject();

        float heading = deviceOrientation.getHeadingDegrees();
        float headingError;
        if (deviceOrientation.hasConservativeHeadingErrorDegrees()) {
            headingError = deviceOrientation.getConservativeHeadingErrorDegrees();
        } else {
            headingError = deviceOrientation.getHeadingErrorDegrees();
        }

        float[] rotationMatrix = new float[9];
        float[] orientationAngles = new float[3];
        SensorManager.getRotationMatrixFromVector(rotationMatrix, deviceOrientation.getAttitude());
        SensorManager.getOrientation(rotationMatrix, orientationAngles);
        float pitch = (float) Math.toDegrees(orientationAngles[1]);
        float roll = (float) Math.toDegrees(orientationAngles[2]);

        data.put("heading", heading);
        data.put("pitch", pitch);
        data.put("roll", roll);
        data.put("headingError", headingError);

        return data;
    }
}

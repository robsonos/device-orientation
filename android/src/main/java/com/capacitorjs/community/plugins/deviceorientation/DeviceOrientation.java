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

import org.json.JSONArray;
import org.json.JSONException;

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

    public static JSObject getDeviceOrientationJSObject(
            com.google.android.gms.location.DeviceOrientation deviceOrientation) {
        JSObject data = new JSObject();

        JSObject fusedData = new JSObject();
        fusedData.put("heading", deviceOrientation.getHeadingDegrees());
        if (deviceOrientation.hasConservativeHeadingErrorDegrees()) {
            fusedData.put("headingError", deviceOrientation.getConservativeHeadingErrorDegrees());
        } else {
            fusedData.put("headingError", deviceOrientation.getHeadingErrorDegrees());
        }
        data.put("fused", fusedData);

        JSObject attitudeData = new JSObject();
        JSObject orientationData = new JSObject();

        float[] attitude = deviceOrientation.getAttitude();
        float[] rotationMatrix = new float[9];
        float[] orientationAngles = new float[3];

        SensorManager.getRotationMatrixFromVector(rotationMatrix, attitude);
        SensorManager.getOrientation(rotationMatrix, orientationAngles);

        orientationData.put("azimuth", Math.toDegrees(orientationAngles[0]));
        orientationData.put("pitch", Math.toDegrees(orientationAngles[1]));
        orientationData.put("roll", Math.toDegrees(orientationAngles[2]));
        data.put("orientation", orientationData);

        try {
            JSONArray quaternionArray = new JSONArray();
            for (float v : attitude) {
                quaternionArray.put(v);
            }
            attitudeData.put("quaternion", quaternionArray);
            data.put("attitude", attitudeData);
        } catch (JSONException e) {
            Log.e(TAG, "Could not serialize attitude data.", e);
        }

        return data;
    }
}

package com.capacitorjs.community.plugins.deviceorientation;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.location.DeviceOrientationListener;
import com.google.android.gms.location.DeviceOrientationRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@SuppressWarnings("unused")
@CapacitorPlugin(name = "DeviceOrientation")
public class DeviceOrientationPlugin extends Plugin {

    private DeviceOrientation implementation;
    private ExecutorService executor;
    private final Map<String, DeviceOrientationListener> watchingListeners = new HashMap<>();
    private final Map<String, PluginCall> watchingCalls = new HashMap<>();

    @Override
    public void load() {
        implementation = new DeviceOrientation(getContext());
        executor = Executors.newSingleThreadExecutor();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void watchOrientation(PluginCall call) {
        call.setKeepAlive(true);
        startWatch(call);
    }

    private void startWatch(PluginCall call) {
        watchingCalls.put(call.getCallbackId(), call);

        // noinspection ConstantConditions
        long samplingPeriodMicros = getOutputPeriod(call.getString("frequency", "default"));

        DeviceOrientationListener listener = deviceOrientation -> call
                .resolve(DeviceOrientation.getDeviceOrientationJSObject(deviceOrientation));

        implementation.watchOrientation(samplingPeriodMicros, listener, executor, call);
        watchingListeners.put(call.getCallbackId(), listener);
    }

    @PluginMethod
    public void clearWatch(PluginCall call) {
        String callbackId = call.getString("id");

        if (callbackId == null || callbackId.isEmpty()) {
            call.reject(DeviceOrientationErrors.WATCH_ID_NOT_PROVIDED.message,
                    DeviceOrientationErrors.WATCH_ID_NOT_PROVIDED.code);
            return;
        }

        DeviceOrientationListener listener = watchingListeners.get(callbackId);

        if (listener == null) {
            call.reject(DeviceOrientationErrors.WATCH_ID_NOT_FOUND.message,
                    DeviceOrientationErrors.WATCH_ID_NOT_FOUND.code);
            return;
        }

        watchingListeners.remove(callbackId);
        implementation.clearWatch(listener);
        watchingCalls.remove(callbackId);

        PluginCall savedCall = bridge.getSavedCall(callbackId);
        if (savedCall != null) {
            savedCall.release(bridge);
        }

        call.resolve();
    }

    @Override
    protected void handleOnPause() {
        super.handleOnPause();
        for (DeviceOrientationListener listener : watchingListeners.values()) {
            implementation.clearWatch(listener);
        }
        watchingListeners.clear();
    }

    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        for (PluginCall call : watchingCalls.values()) {
            startWatch(call);
        }
    }

    @Override
    protected void handleOnDestroy() {
        if (executor != null) {
            executor.shutdown();
        }
        super.handleOnDestroy();
    }

    private long getOutputPeriod(String frequency) {
        return switch (frequency) {
            case "medium" -> DeviceOrientationRequest.OUTPUT_PERIOD_MEDIUM;
            case "fast" -> DeviceOrientationRequest.OUTPUT_PERIOD_FAST;
            default -> DeviceOrientationRequest.OUTPUT_PERIOD_DEFAULT;
        };
    }
}

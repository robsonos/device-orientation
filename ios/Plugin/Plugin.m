#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(DeviceOrientation, "DeviceOrientation",
           CAP_PLUGIN_METHOD(watchOrientation, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(clearWatch, CAPPluginReturnPromise);
)

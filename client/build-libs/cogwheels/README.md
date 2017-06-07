Cogwheels framework

## install

```bash
npm install cogwheels --save-dev
```

copy over from node_modules/cogwheels/builds/

## Patch v1.0.4
Added configuration for router (noInitialRouting), to prevent router start to call navigate.

## Patch v1.0.3
Fixed bug regarding dynamically adding and removing a regionHandler that caused re-render of regions to fail.

## Patch v1.0.2
Changed default behavior of lifecycle-manager to propagate errors. 
Added option to lifecycle-manager "silentErrors" to go back to old behavior

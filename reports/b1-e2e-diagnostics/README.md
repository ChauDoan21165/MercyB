# B1 E2E Diagnostics

Placement V3 E2E failure diagnostics are written here by `capturePlacementV3Diagnostics`.

Each failure capture includes:

- JSON state snapshot
- screenshot
- current URL
- active task/control metadata
- submit disabled state
- visible validation errors
- feature-flag route visibility signal
- pending network requests tracked by the E2E helper
- Playwright trace output directory

Successful runs may leave this directory empty except for this README.

# Versioning

This doc describe how to version this app.

## Format

Format is : **X.Y.Z**

e.g 2.0.1

Before deploy you must update project metadata by respecting this format **X.Y.Z** by increasing these values :

- **X** Major version (every year when the project drastically change)
- **Y** Minor version (updated every sprint)
- **Z** fix (when a batch of fixes is deployed)

\_**NB** Version number from **package.json** is logged by the app.

Every release [changelog](./CHANGELOG.md) must be updated.

## Tagging

Every release must be tagged.

With the following tag format : **[version number vX.Y.Z]--[date with format YYYYMMDD]**

e.g : v2.0.0-20201001

Tag must be applied on last released commit.

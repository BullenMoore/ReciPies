# ReciPies - A recipe manager

- [About](#about)
- [Features](#features)
- [Planned features](#planned-features)
- [Known issues](#known-issues)
- [How to set up](#how-to-set-up)
- [Examples](#examples)
- [Version explanation](#version-explanation)
- [License, usage and attribution](#license-usage-and-attribution)

## About

This C# project was created out of necessity to host/view my own recipes on multiple devices. It is just a framework
for adding, editing, deleting and categorizing recipes from a hosted website.<br/>
**IMPORTANT: This is not a hosted service, you will need to host or run it yourself if you want your own recipe manager.**

This is basically a database that stores recipe tables and uses a web interface to view and edit them.

## Features

- Uses SQLite as its database, handles the storage of recipes gracefully and can be easily backup-ed.
- Two use cases, either as a standalone app (Windows, hopefully Mac and Linux (Phone/tablet maybe)) or as a webpage-service for several users. (WIP)
- Fit for all screen sizes, especially useful with the web-service. (WIP)
- The ability to upload pictures to a recipe, both as the display photo and instruction photos (using Markdown). (WIP)

## Planned features

- Some sort of admin login, or accounts in general. Not everyone should be allowed to edit/delete recipes.
- Tag and name filtering on the home page
- A standalone app version, this would make the service into an application that is only "online" while the user needs it to be. For a single device if the user don't want a hosted service, but instead just wants an app for recipes (maybe a dedicated window as well).
- Allowing scaling of ingredients.
- Recalculate measurements when scaling. (example: 3 teaspoons = 1 tablespoon)
- A proper way of adding and handling images

## Known issues

- Uploading images currently does nothing

## How to set up

TBA



## Examples

TBA

## Version explanation

Those with a keen eye may notice the version formatting for every commit, for those interested that is explained here (X is the explained number):

### vX.#.#
Major changes, such as major overhauls where a large piece of code or functionality is remade or introduced.

### v#.X.#
Mostly for new feature introduction, such as a search field at the home page or introduction of a comment section.

### v#.#.X
Mostly for bugfixes and typos.

## License, usage and attribution

This program is licensed under the MIT License (see [`LICENSE.md`](LICENSE.md)). You are free to use, modify, distribute, and commercialize it under the terms of that license.

While not required by the license, I kindly ask that the name and version of *ReciPies* is declared somewhere on your instance of the site, preferably with a link to this repository.
See [`ATTRIBUTION.md`](ATTRIBUTION.md) for examples.

Third-party licenses are listed in [`THIRD-PARTY-NOTICES.txt`](THIRD-PARTY-NOTICES.txt).

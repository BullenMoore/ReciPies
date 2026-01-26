# ReciPies - A recipe manager

- [About](#about)
- [Features](#features)
- [Planned features](#planned-features)
- [Known issues](#known-issues)
- [How to set up](#how-to-set-up)
- [Examples](#examples)
- [License, usage and attribution](#license-usage-and-attribution)

## About

This C# project was created out of necessity to host/view my own recipes on multiple devices. It is just a framework
for adding, editing, deleting and categorizing recipes from a hosted website.<br/>
**IMPORTANT: This is not a hosted service, you will need to host it yourself if you want your own recipe manager.**

This is basically a database that stores recipe tables and uses a web interface to view and edit them.

## Features

- Uses SQLite as its database, fast and efficient.
- Several ways of setting it up, should cover most users.

## Planned features

- Some sort of admin login, or accounts in general. Not everyone should be allowed to edit/deleting recipes.
- Instruction photos in the description of the recipe, might help some users.

## Known issues

- No way of deleting ingredients from a recipe
- Adding new tags to a recipe doesn't do anything

## How to set up

TBA

[
### Windows
For Windows it is easiest to use the executable provided in the releases. It will launch and act as a background service, and can be seen in the tray menu.

Alternatively you can build the project yourself (just follow the Linux steps below).

### Linux

1. Install the dotnet sdk. (net9.0)

``` shell
apt-get install "something"
```
2. Build the project

``` shell
dotnet build projectname
```
3. Launch the program
``` shell
launch launch launch
```

### Docker
TBA
comment]:#

## Examples

TBA

[
(Some images showing of the main index page, recipe page, edit page etc.)

You can also check how the program works live at my own hosting of the manager on my own website (<- Hyperlink TBA).
comment]:#
## License, usage and attribution

This program is licensed under the MIT License (see [`LICENSE.md`](LICENSE.md)). You are free to use, modify, distribute, and commercialize it under the terms of that license.

While not required by the license, I kindly ask that the name and version of *ReciPies* is declared somewhere on your instance of the site (preferably with a link to this repository).
See [`ATTRIBUTION.md`](ATTRIBUTION.md) for example(s).

Third-party licenses are listed in [`THIRD-PARTY-NOTICES.txt`](THIRD-PARTY-NOTICES.txt).
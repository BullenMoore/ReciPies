# Attribution Examples

The following are examples of how attribution may be displayed.
These are suggestions only and are not required by the License (see [`LICENSE.md`](LICENSE.md)).

Examples:
- “Made with ReciPies v#.#” (# is the version you're using)
- “Powered by ReciPies” (linking to the repository)

The best option (according to me) is to state both the version number and link to the repository. It can be done like this:
```html
<h6>Made with <a href="https://github.com/BullenMoore/ReciPies">ReciPies @currentVersion</a></h6>
```
The variable *currentVersion* is declared in *_Layout.cshtml*, which is where this code snippet is taken from.
This is the easiest way of attributing on every page. *currentVersion* should be automatically updated when a new version is commited.
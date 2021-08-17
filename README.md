# OE CSS (newblue)

The "newblue" CSS repository allows for the development of OpenEyes UI(X) independently of other OpenEyes development work. This is achieved through iDG (a frontend UX prototyping site). ("newblue" started as a moniker for the major v3 UI development work and it just stuck.)

## Concept

* Create a clean, elegant UI(X) that is easy to use
* Minimise visual clutter without losing data clarity
* Present data in a consistent and efficient way to better assist clinical tasks.
* Reduce vertical scrolling as much as possible (clinical requirement)


## Browser support

* Chrome > 60
* Edge > 15

## JS hooks

* CSS classes used only as JS hooks (i.e. not being used by CSS to style anything) should be prefixed with `js-`. 

## Theme naming

Originally conceived as "Pro" & "Classic" these are now respectively "Dark" & "Light". You may find usage of "pro-theme" in some of the older sass files.

## Opinionated SCSS guides

Basically, follow best practices...

* Never use `!important` (unless you really, really must...)
* Never use ID's for styling. This avoids specificity issues (although, some top level elements do - for historical reasons)
* Use lower-case for classnames, with words separated by a hyphen. (e.g. `.btn-dropdown`)
* Generally, try and use an object orientated approach. Don't name your subclasses with a prefix of the class you're extending. 
* Generally use semantic, descriptive classnames that hint at their function.
* Avoid qualifying class names with type selectors e.g. `div.myclass` (Unless you want the class to be bound to a specific DOM element).
* Keep your selectors short! And try to keep your selectors shallow. 

## Iconography

* Event icons must be 76px x 76px, and named correctly. 
* Eyedraw icon (doodles) must be 32px x 32px, and named correctly.
* SVGs are used in a few different flavours, see source for examples.

## Please do not use inline styles for adjusting styling

**Why not?** For the following reasons:

1. Themes (any inline DOM styling could prove problematic)
2. Responsive layout (newblue UI responsiveness is highly bespoke)
3. UI consistency (consistent data presentation has many, many benefits)
4. Unnecessary (somewhere in the OE UI is possibly a UI solution already created)
5. Flagging up issues with the CSS helps to improve the overall UI across the board

(To be clear, we are not talking about JS positional stuff, but this does include z stacking which does need considering globally)

### Finally...

The smallest supported  width is 1200px, with the UIX being tailored to run on handheld tablets, as well as on super-wide displays. 



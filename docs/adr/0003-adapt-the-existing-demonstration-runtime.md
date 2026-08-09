# Adapt the existing demonstration runtime

The native shared player will adapt the demonstrations' existing global `lineExports.init()`, `render_init()`, and `render()` interface instead of converting every frame generator and D3 renderer to ES Modules. Shared UI code may use modern modules, while demonstration scripts remain classic scripts and change only where resource paths or confirmed blocking defects require it. Keeping this deliberately narrow separates removal of Vue and Webpack from a much riskier rewrite of the algorithms themselves.

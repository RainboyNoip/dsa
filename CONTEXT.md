# DSA Animation

This context describes the interactive learning material presented by DSA Animation and the language used to discuss it.

## Language

**DSA Animation**:
The data structures and algorithms animation site, formally named "数据结构与算法动画" in Chinese and "Data Structures and Algorithms Animation" in English.
_Avoid_: rainboy-dsaa, Data Structure Alghoritm Animation, Data Struct Animation

**Algorithm Demonstration**:
An interactive teaching unit that presents source code, animation, and a frame-by-frame explanation of one algorithm or programming concept.
_Avoid_: Page, route, DSA data

**Available Demonstration**:
An Algorithm Demonstration whose existing material can be loaded and used. The migration includes Available Demonstrations but does not create missing demonstrations or expose incomplete placeholders.
_Avoid_: Existing directory, valid link

**Demonstration Frame**:
One observable step in an Algorithm Demonstration, combining a visualization state with the corresponding source-code highlight and optional narration.
_Avoid_: Slide, status

**Narration Log**:
The ordered collection of non-empty frame narrations from the beginning of an Algorithm Demonstration through its current frame. It reflects demonstration progress rather than the user's interaction history.
_Avoid_: Logger, console, operation history

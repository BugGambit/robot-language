PICK - will pick up if there is a plate on the grid cell and put it on top of the stack
DROP - will drop the plate on top of the stack if the stack contains at least one plate and the grid cell is empty
MOVE (LEFT|RIGHT|UP|DOWN) - moves in the direction if it does not go outside the grid
<!-- PEAK - returns True if there is a plate on the cell -->

Example code:

```
MOVE RIGHT
MOVE RIGHT
PICK
MOVE DOWN
DROP
MOVE UP
MOVE RIGHT
PICK
MOVE DOWN
DROP

WHILE (MOVE RIGHT) {
    PICK
}
MOVE DOWN
WHILE (MOVE LEFT) {}
WHILE (MOVE RIGHT) {
    DROP
}
```
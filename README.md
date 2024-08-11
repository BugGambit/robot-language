PICK - will pick up if there is a plate on the grid cell and put it on top of the stack
DROP - will drop the plate on top of the stack if the stack contains at least one plate and the grid cell is empty
MOVE (LEFT|RIGHT|UP|DOWN) - moves in the direction if it does not go outside the grid
<!-- PEAK - returns True if there is a plate on the cell -->

Tasks:

1. Pick up all numbers
Example:
```
while (move left) {}
while (move up) {}

do {
  do {
    pick
  } while (move right)
  move down
  do {
    pick
  } while (move left)
} while (move down)
```
2. End program with highest number in the stack only
3. Put a number in each corner (only 4 numbers)
```
while (move left) {}
while (move up) {}

do {
  do {
    pick
  } while (move right)
  move down
  do {
    pick
  } while (move left)
} while (move down)

while (move left) {}
while (move up) {}
drop

while (move right) {}
drop

while (move down) {}
drop

while (move left) {}
drop
```
4. Put all numbers in the first row in sorted order
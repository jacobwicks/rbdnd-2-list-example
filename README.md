# rbdnd-2-list-example
A small project using react-beautiful-drag and drop and semantic-ui-react

Hi there! I'm using React-Beautiful-Dnd to add drag and drop functionality to one of my projects. I found the documentation to be pretty advanced and the examples were hard to follow because they had a lot of nested code. It took me a while to start to figure things out. I also saw a lot of requests for basic guides when I was looking for how to use it. So I created this project to show a very simple drag and drop operation.

This project lets you drag and drop 'draggable' items between two 'droppable' containers.  The contents of the containers is tracked in the state of the component. The project also creates a message based on the contents of the second droppable container.

This project uses semantic-ui-react for the components like Labels and Buttons etc. See: https://react.semantic-ui.com/introduction

The javascript commands you will encounter include the spread operator (...), the ternary (?), splice, react state, and the map command. Besides that, the most complicated thing you will see is the Draggable component provided by react-beautiful-dnd.

The working parts of this project:

DragDropContext : React Beautiful DnD has you wrap your app in this component. When draggable items are dragged around inside a dragdropcontext, events fire and you use those events to move your draggable objects around.

onDragEnd : One of the dragging events is onDragEnd. This event fires when you stop dragging a draggable item around. Among other things, onDragEnd tells you
1. What droppable list the draggable item started in
2. What the index of the draggable item was in the droppable list where it started
3. What droppable list the draggable item ended in. It also tells you if the draggable item was dropped somewhere that isn't a droppable list.
4. What the index of the draggable item was in the droppable list where it ended up (if it was put into a droppable list).
So, when onDragEnd fires, we check
1. if the draggable item was dropped in a list
2. if the list it was dropped into was the same list it was already in
3. if the list it was dropped into was a different list than it started in

staticItems : an array of objects. These objects get converted into the draggable items. The map command is used to turn each object in the array into a label.

reorder : a function that changes the order of a list of objects. This is used when you move a draggable object around within a droppable list. reorder returns the array with the objects in the correct order.

moveAndReorder : a function that removes a draggable object from the droppable list that it was in and then adds that draggable object to the droppable list you put it in. This is used when you move a draggable object from one droppable list to another droppable list.

Droppable : this is a react component that we get from react-beautiful-dnd. It becomes an area on the screen where you can drop draggable items.

droppableId: you have to give the Droppable component a droppable Id. Just name it what you want.
provided: this contains props that your draggable items will need. You give those props to your draggable items using the spread (...) operator.
snapshot: holds some data about the particular draggable item. For example, snapshot.isDragging returns true while the draggable item is selected and being dragged around. So you can make your draggable item a different color while the user is dragging it around.

Here's an example of a droppable component written as simply as I can manage.
In the project, you will see that we use the map command inside of a droppable component to change an array of objects into many draggable objects.
But there is no draggable object in this droppable component right now.
`
<Droppable droppableId="whateverNameYouWant">
  {(provided, snapshot) => (
              <div ref={provided.innerRef} >
                  {provided.placeholder}
              </div>
  )}
  </Droppable>
`

  Here's an example of a draggable component written as simply as I can manage.
  In the project, you will see that we use the map command to change an array of objects into many draggable objects.
  But this is just one draggable object created on its own.

`
  <Draggable key={1} draggableId={1} index={0}>
    {(provided, snapshot) => (
      <div>
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
        Drag me, my friend.
        </div>
        {provided.placeholder}
      </div>
    )}
  </Draggable>
`

Here's an example of a droppable component with a draggable component inside of it.

`
<Droppable droppableId="whateverNameYouWant">
  {(provided, snapshot) => (
              <div ref={provided.innerRef} >

                  <Draggable key={1} draggableId={1} index={0}>
                    {(provided, snapshot) => (
                      <div>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                        Drag me, my friend.
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>

                  {provided.placeholder}
              </div>
  )}
  </Droppable>
`

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './semantic/dist/semantic.css';
import { Button, Container, Header, Input, Label, Message, Segment } from 'semantic-ui-react';

//this is just an array of items to start out using
//you don't have to declare it here, you could declare it down in state if you wanted
//I think you have to have content and id in each item
const staticItems = [ {content: "Hello", id: "1"},
                      {content: "World", id: "2"},
                      {content: "Goodbye", id: "3"},
                      {content: "LaLa", id: "4"},
                      {content: "Insult", id: "5", words: `You're a jerk, <<recipientName>>. A complete kneebiter.`},
                      {content: "Compliment", id: "6", words: `You look great, <<recipientName>>. Have you lost weight?`}
                    ]

//'reorder' reorders the list it is given, moving the draggable from the startIndex to the endIndex and returning an array
//it's a function- see the => below
// it takes three parameters- an array and two numbers
//the stuff after : defines the acceptable types of the parameters
const reorder = (
  list: any[],
  startIndex: number,
  endIndex: number): any[] => {
                                const result = Array.from(list);
                                const [removed] = result.splice(startIndex, 1);
                                result.splice(endIndex, 0, removed);
                                return result;
                              };

 //move and reorder first moves the draggable from one list to the other
 //then reorders the destination list
 //and returns two arrays
 //this is a function (see the => below!) with many parameters
 //the stuff after : defines the acceptable types of the parameters
 const moveAndReorder = (
  sourceList: any[],
  sourceStartIndex: number,
  destinationList: any[],
  destinationEndIndex: number): any[] => {
                                            let sourceResult = Array.from(sourceList);
                                            //designate the draggable to be removed from sourceResult
                                            let [removed] = sourceResult.splice(sourceStartIndex, 1);
                                            //because we used splice, sourceresult no longer contains the element that was moved out of it

                                            const destinationResult = Array.from(destinationList);
                                            //add the draggable that we removed from the sourceList into the destinationResult
                                            destinationResult.splice(destinationEndIndex, 0, removed);

                                            //return the two arrays
                                            //sourceResult should be the source droppable but without the draggable that got moved
                                            //destinationResult should be the destination droppable with the moved draggable added
                                            //in the correct position
                                            return [sourceResult, destinationResult]
                                          };


class App extends Component {
  //we declared staticItems above
  //lower items is just an empty array
state = { items: staticItems,
          lowerItems: [],
          hidden: true,
          yourName: "",
          recipientName: "",
          };

//this function turns the message display on and off
toggleMessage = () => this.setState((prevState) => ({ hidden: !prevState.hidden}));

//when Dragging ends, we look at the place the item was dropped -
//outside a droppable, in the same droppable, or in another droppable
  onDragEnd = (result) => {

    // if it's dropped outside a droppable
    //result does not have a destination
    //we return null
    if (!result.destination) {
      return;
    }

    //if source.droppableId does not equal destination.droppableId,
    //that means the draggable item was dragged from one droppable into another droppable
    //then you need to remove the Draggable from the source.droppableId list
    //and add it into the correct position of the destination.droppableId list.

    //prepare to compare the source to the destination
    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;
    let sourceId = source.droppableId;
    let destinationId = destination.droppableId;

    console.log(`moving from ${sourceId} to ${destinationId}`);

    //just a short form of the two item arrays from state
    let items = this.state.items;
    let lowerItems = this.state.lowerItems;

    //If the place we moved the draggable out of is different from the place we moved it to, execute this
    if (sourceId !== destinationId)
    {
      console.log(`Hey, looks like source droppable (${sourceId}) is different from destination droppable (${destinationId})`)
      //we only have two lists- droppable1 and droppable2
      //so if the source is droppable1, then the destination is droppable2
      if (sourceId === "droppable1")
      {
      let sourceList = items;
      let destinationList = lowerItems;
      //Note: source.index and destination.index are generated onDragEnd-
      //source.index is the index where the dragged item started out in the source droppable
      //destination.index is the index where the dragged item was placed by the user, in the destination droppable
      //after we pass the parameters to moveAndReorder, we will get back an array of two arrays
      //lists[0] will be the source droppable with the moved draggable taken out
      //lists[1] will be the target droppable with the moved draggable added in at the correct index
      let lists = moveAndReorder(
       sourceList,
       source.index,
       destinationList,
       destination.index
     );
     //so now we set the state to our two lists
     this.setState({items: lists[0], lowerItems: lists[1]})
  } else if (sourceId === "droppable2") {
    let sourceList = lowerItems;
    let destinationList = items;
    let lists = moveAndReorder(
     sourceList,
     source.index,
     destinationList,
     destination.index
   );

   this.setState({lowerItems: lists[0], items: lists[1]})
  }

} else { //If it was moved within the same list, then just reorder that list
     console.log(`Source is the same as destination`);
     console.log(`reordering ${sourceId}`);
    if (sourceId === "droppable1")
      {
        items = reorder(
         this.state.items,
         source.index,
         destination.index );

      this.setState({items: items});
    } else if (sourceId === "droppable2") {
       lowerItems = reorder(
       this.state.lowerItems,
       source.index,
       destination.index );

      this.setState({lowerItems: lowerItems});
    }
  }
}

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    let yourName = this.state.yourName;
    let recipientName = this.state.recipientName;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      <Container>
      <br />
      <Header as='h2'>Make a custom message using text inputs & drag and drop items!</Header>
      <br />
      <Segment>
        Give us some information about the message: <br />
        <Input
          label='Your name'
          value={yourName}
          onChange={(e, { value }) => this.setState({yourName: value})}/>
        <br />
        <Input
          label={`Recipient's name`}
          value={recipientName}
          onChange={(e, { value }) => this.setState({recipientName: value})}/>
        <br />
      </Segment>
      <br />
        <Droppable droppableId="droppable1">
          {(provided, snapshot) => (
            <Segment color={snapshot.isDraggingOver && 'blue'}
              inverted={snapshot.isDraggingOver}
              tertiary={snapshot.isDraggingOver}
              >
            <div
              ref={provided.innerRef}
            > These items can be added to your message below. Drag them around! <br />
              Red items are a single word. <br/>
              Orange items have more content. <br/>
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}

                      >
                        <Label size='large'
                          color={snapshot.isDragging ? 'green' : (item.words ? 'orange' : 'red') }
                          content={item.content}/>
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
            </Segment>
            )}
        </Droppable>
    <br/>
      <Droppable droppableId="droppable2">
{(provided, snapshot) => (
        <Segment color={snapshot.isDraggingOver && 'blue'}
          inverted={snapshot.isDraggingOver}
          tertiary={snapshot.isDraggingOver}
          >
          <div
            ref={provided.innerRef}
          >  {this.state.lowerItems.length > 0 ? 'These items are in your message' : 'Drop items here to write your custom message!'}
          {this.state.lowerItems.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div>
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}

                  >
                    <Label size='large'
                      color={snapshot.isDragging ? 'green' : (item.words ? 'orange' : 'red') }
                      content={item.content}/>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      </Segment>
      )}
      </Droppable>
    <br/>
    <br/>
    <Button onClick={() => this.toggleMessage()}> {this.state.hidden ? 'Show' : 'Hide'} custom message</Button>
  <Message hidden={this.state.hidden}>
    {(this.state.lowerItems.length > 0)
      ? <div> Message is: <br /> {this.state.lowerItems.map(i => i.words
                                                                  ? <div> {i.words.replace("<<recipientName>>", recipientName)} <br /> </div>
                                                                  : <div> {i.content + ','} <br /> </div>)}
                                  <br/>
                                  {this.state.yourName && <div>- {this.state.yourName} </div>}
                                  </div>
      : <div> I got nothin to say! </div>
    }
  </Message>
  <br />
  <br />
  <Label>Enjoy your message!</Label>
  </Container>
  </DragDropContext>
    );
  }
}

// Put the thing into the DOM!
ReactDOM.render(<App />, document.getElementById('root'));

export default App;

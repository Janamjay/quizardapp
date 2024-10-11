import  { useState } from "react";
import "./App.css";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
  tab: 9,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

export default function App() {

  // const defaultList = ["A", "B", "C", "D", "E"];
  // const [itemList, setItemList] = useState(defaultList);
  // const handleDrop = (droppedItem) => {
  //   if (!droppedItem.destination) return;
  //   var updatedList = [...itemList];
  //   const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
  //   updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
  //   setItemList(updatedList);
  // };
  const [tags, setTags] =useState([]);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  return (
    <div className="App">
      {/* <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="list-container">
          {(provided) => (
            <div
              className="list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {itemList.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <div
                      className="item-container"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext> */}
          <ReactTags
      tags={tags}
      delimiters={delimiters}
      handleDelete={handleDelete}
      handleAddition={handleAddition}
      handleDrag={handleDrag}
      inputFieldPosition="top"
      autocomplete
      autofocus={true}
      maxTags={5}
    />
    </div>
  );
}


/* .App {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.list-container {
  display: flex;
  font-size: 18px;
  background-color: #eee;
  flex-direction: column;
}
.item-container {
  background-color: #fff;
  border: 1px solid black;
  padding: 25px 70px;
  margin: 15px 50px;
} */
/* Example Styles for React Tags*/
// .app {
//   padding: 40px;
//   text-align: center;
// }

// /* Example Styles for React Tags*/
// .app {
//   padding: 40px;
//   text-align: center;
// }

// /* Example Styles for React Tags*/

// .container {
//   margin: auto;
//   width: 50%;
// }
// .ReactTags__tags {
//   position: relative;
// }

// .ReactTags__clearAll {
//   cursor: pointer;
//   padding: 10px;
//   margin: 10px;
//   background: #f88d8d;
//   color: #fff;
//   border: none;
// }

// /* Styles for the input */
// .ReactTags__tagInput {
//   border-radius: 2px;
//   display: inline-block;
// }
// .ReactTags__tagInput input.ReactTags__tagInputField,
// .ReactTags__tagInput input.ReactTags__tagInputField:focus {
//   height: 31px;
//   margin: 0;
//   font-size: 12px;
//   border: 1px solid #eee;
//   min-width: 150px;
// }

// .ReactTags__editInput {
//   border-radius: 1px;
// }

// .ReactTags__editTagInput {
//   display: inline-flex;
// }

// /* Styles for selected tags */
// .ReactTags__selected span.ReactTags__tag {
//   border: 1px solid #ddd;
//   background: #63bcfd;
//   color: white;
//   font-size: 12px;
//   display: inline-block;
//   padding: 5px;
//   margin: 0 5px;
//   border-radius: 2px;
// }
// .ReactTags__selected a.ReactTags__remove {
//   color: #aaa;
//   margin-left: 5px;
//   cursor: pointer;
// }

// /* Styles for suggestions */
// .ReactTags__suggestions {
//   position: absolute;
// }
// .ReactTags__suggestions ul {
//   list-style-type: none;
//   box-shadow: 0.05em 0.01em 0.5em rgba(0, 0, 0, 0.2);
//   background: white;
//   width: 200px;
// }
// .ReactTags__suggestions li {
//   border-bottom: 1px solid #ddd;
//   padding: 5px 10px;
//   margin: 0;
// }
// .ReactTags__suggestions li mark {
//   text-decoration: underline;
//   background: none;
//   font-weight: 600;
// }
// .ReactTags__suggestions ul li.ReactTags__activeSuggestion {
//   background: #b7cfe0;
//   cursor: pointer;
// }

// .ReactTags__remove {
//   border: none;
//   cursor: pointer;
//   background: none;
//   color: white;
// }

// .ReactTags__error {
//   color: #e03131;
//   font-size: 12px;
//   font-weight: 500;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
//   .ReactTags__error > svg {
//     padding: 0 5px;
//     height: 14px !important;
//     width: 14px !important;
//   }

import { StatusBar } from "expo-status-bar";
import shortid from "shortid";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Button, Pressable
} from "react-native";
import { API, Amplify, graphqlOperation } from "aws-amplify";
import config from "./aws-exports";
import { addTodo, deleteTodo, updateTodo } from "./src/graphql/mutations";
import { getTodos } from "./src/graphql/queries";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
// import {WithAuthenticator,Authenticator} from "aws-amplify-react"
// import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
// import { Authenticator } from "aws-amplify-react-native";
import { useRef } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"



Amplify.configure(config);

// const initialState = { id: '', title: '', done: '' };

// const userSelector = (context: any) => [context.user]

// const SignOutButton = () => {
//   const { user, signOut } = useAuthenticator(userSelector);
//   return (
//     <Pressable onPress={signOut} style={styles.buttonContainer}>
//       <Text style={styles.buttonText}>
//         Hello, {user.username}! Click here to sign out!
//       </Text>
//     </Pressable>
//   );
// };

interface title {
  title: string
  id: string
}

interface incomingData {
  data: {
    todoList: title[]
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      textAlign: "center",
    },
    parent: {
      textAlign: "center",
    },
    dataDisplay: {
      backgroundColor: "#eeeeee",
      marginBottom: "10px",
    },
    textField: {
      width: "100%",
      textAlign: "center",
    },
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
)


function App() {
  // const [data, setData] = useState();

  // async function fetchTodos() {
  //   try {
  //     const todoData = await API.graphql(graphqlOperation(getTodos));
  //     // console.log("todoData=>", todoData?.data?.getTodos);
  //     const myData = todoData?.data?.getTodos;
  //     console.log("myData=>", myData);
  //     setData(myData);
  //   } catch (e) {
  //     console.log("error=>", e);
  //   }
  // }

  // useEffect(() => {
  //   fetchTodos();
  // }, []);

  // console.log("dataUseState=>", data);
  const [loading, setLoading] = useState(true)
  const [todoData, setTodoData] = useState<incomingData | null>(null)
  const todoTitleRef = useRef<any>("")

  const addTodoMutation = async () => {
    try {
      const todo = {
        id: shortid.generate(),
        title: todoTitleRef.current.value,
        done: false,
      }
      const data = await API.graphql({
        query: addTodo,
        variables: {
          todo: todo,
        },
      })
      todoTitleRef.current.value = ""
      fetchTodos()
    } catch (e) {
      console.log(e)
    }
  }

  const deleteTodoMutation = async (id: string) => {
    try {
      const todoId = id

      const data = await API.graphql({
        query: deleteTodo,
        variables: {
          todoId: todoId,
        },
      })
      fetchTodos()
    } catch (e) {
      console.log(e)
    }
  }

  const updateTodoMutation = async (item: any) => {
    try {
      const todo = {
        id: item.id,
        title: item.title,
        done: item.done,
      }
      var val = prompt("Enter Updated Value", todo.title)
      todo.title = val

      const data = await API.graphql({
        query: updateTodo,
        variables: {
          todo: todo,
        },
      })
      fetchTodos()
    } catch (e) {
      console.log(e)
    }
  }

  const fetchTodos = async () => {
    try {
      const data = await API.graphql({
        query: getTodos,
      })
      console.log("fdata", data)

      setTodoData(data as incomingData)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    // <SafeAreaView style={styles.container}>
    //   <Authenticator />
    //   <Text>Open up App.tsx to start working on your app!</Text>
    //   {/* <FlatList
    //       keyExtractor={(item) => item.id}
    //       data={data}
    //       renderItem={({ item }) => <Text>{item.task}</Text>}
    //     /> */}
    //   {data?.map((item: any) => {
    //     return (
    //       <View>
    //         {" "}
    //         <Text>{item.title}</Text>
    //         {/* <Button>X</Button> */}
    //       </View>
    //     );
    //   })}

    //   <StatusBar style="auto" />
    // </SafeAreaView>
    <div className="main_div">
      <h2 className="heading">Serverless TodoApp</h2>
      {loading ? (
        <h1>Loading ...</h1>
      ) : (
        <div className="add_task_div">
          <label>
            Todo:
            <input className="input" ref={todoTitleRef} />
          </label>
          <button className="add_btn" onClick={() => addTodoMutation()}>
            Add Todo
          </button>
          {todoData?.data &&
            todoData.data.getTodos.map((item, ind) => (
              <div
                className="task_main_div"
                style={{ marginLeft: "1rem", marginTop: "2rem" }}
                key={ind}
              >
                {item.title}
                {"  "}
                <button
                  className="deleteTask_icon"
                  onClick={() => deleteTodoMutation(item.id)}
                >
                  X
                </button>
                {/* <button onClick={() => prompt("Entervalue",JSON.stringify(item.title))}>
                  Update
                </button> */}
                <button
                  className="updateTask_icon"
                  onClick={() => updateTodoMutation(item)}
                >
                  U
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: 'white', padding: 16, fontSize: 18 },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 8,
  },
});


export default App
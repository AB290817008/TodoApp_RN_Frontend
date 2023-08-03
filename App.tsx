import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Button,
} from "react-native";
import { API, Amplify, graphqlOperation } from "aws-amplify";
import config from "./aws-exports";
import { addTodo, deleteTodo, updateTodo } from "./src/graphql/mutations";
import { getTodos } from "./src/graphql/queries";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";

Amplify.configure(config);

// const initialState = { id: '', title: '', done: '' };

export default function App() {
  const [data, setData] = useState();

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(getTodos));
      // console.log("todoData=>", todoData?.data?.getTodos);
      const myData = todoData?.data?.getTodos;
      console.log("myData=>", myData);
      setData(myData);
    } catch (e) {
      console.log("error=>", e);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  console.log("dataUseState=>", data);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      {/* <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => <Text>{item.task}</Text>}
        /> */}
      {data?.map((item: any) => {
        return (
          <View>
            {" "}
            <Text>{item.title}</Text>
            {/* <Button>X</Button> */}
          </View>
        );
      })}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [tarefa, setTarefa] = useState('')
  const [lista, setLista] = useState([])

 
  useEffect(() => {
    const pegarTarefas = async () => {
      const guardadas = await AsyncStorage.getItem('tarefas')
      if (guardadas != null) {
        setLista(JSON.parse(guardadas))
      }
    }
    pegarTarefas()
  }, [])

  
  useEffect(() => {
    AsyncStorage.setItem('tarefas', JSON.stringify(lista))
  }, [lista])

  const adicionar = () => {
    if (tarefa === '') 
    {return;
    }

    const nova = { 
      id: Date.now(), 
      texto: tarefa, 
      feita: false }

    const novaLista = lista.concat(nova)
    setLista(novaLista)

    setTarefa('')
    
  }

  
  const marcar = (id) => {
    const novaLista = []
    for (let i = 0; i < lista.length; i++) {
      const item = lista[i]
      if (item.id === id) {
        novaLista.push(
          { id: item.id,
           texto: item.texto,
            feita: !item.feita }
          )
      } else {
        novaLista.push(item)
      }
    }
    setLista(novaLista)
  }

  
  const apagar = (id) => {
    const novaLista = []
    for (let i = 0; i < lista.length; i++) {
      if (lista[i].id !== id) {
        novaLista.push(lista[i])
      }
    }
    setLista(novaLista)
  }

 
  let itens = []
  for (let i = 0; i < lista.length; i++) {
    const item = lista[i]
    itens.push(
      <View key={item.id} style={styles.item}>
        <TouchableOpacity style={styles.itemToque} onPress={() => marcar(item.id)}>
          <Text style={styles.check}>
          {item.feita ? '[x]' : '[ ]'}</Text>
          <Text style={item.feita ? styles.textoFeito : styles.texto}>{item.texto}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => apagar(item.id)}>
          <Text style={styles.excluir}>X</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          value={tarefa}
          onChangeText={(texto) => setTarefa(texto)}
          placeholder="Escreva uma tarefa"
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity onPress={adicionar}>
          <Text style={styles.botao}>+</Text>
        </TouchableOpacity>
      </View>
      {lista.length === 0 ? <Text style={styles.vazio}>Nenhuma tarefa ainda.</Text> : null}
      <ScrollView style={styles.lista}>{itens}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center'
  },
  title: {
    marginTop: 15,
    fontSize: 30,
    textAlign: 'center'
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  input: {
    width: 280,
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10
  },
  botao: {
    backgroundColor: 'blue',
    color: '#FFF',
    height: 40,
    padding: 10,
    marginLeft: 4,
    borderRadius: 10
  },
  lista: {
    width: 320,
    marginTop: 10
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    padding: 10
  },
  itemToque: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  check: {
    marginRight: 10
  },
  texto: {
    fontSize: 16
  },
  textoFeito: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888'
  },
  excluir: {
    color: 'red',
    fontSize: 18,
    padding: 5
  },
  vazio: {
    marginTop: 20,
    color: '#888'
  }
})
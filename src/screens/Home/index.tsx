import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage,
  LoadContainer
} from './styles';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);


  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    const dataKey = '@passmanager:logins';
    const response = await AsyncStorage.getItem(dataKey);
    const Dados = response ? JSON.parse(response) : [];

    //console.log(Dados);
    setSearchListData(Dados);
    setData(Dados);
    setIsLoading(false);
  }
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  function handleFilterLoginData(search: string) {
    // Filter results inside data, save with setSearchListData
    //console.log(search);
    if (!search) {
      return setSearchListData(data);
    }
    
    const result = data.filter(item => item.title.includes(search));
    setSearchListData(result);
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />
      
      {isLoading ?
        <LoadContainer>
          <ActivityIndicator  size="small" color="#ffffff" />
        </LoadContainer> :
        
        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          ListEmptyComponent={(
            <EmptyListContainer>
              <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
            </EmptyListContainer>
          )}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              title={loginData.title}
              email={loginData.email}
              password={loginData.password}
            />
          }}
        />

      }

    </Container>
  )
}
import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, AsyncStorage, KeyboardAvoidingView} from "react-native";
import {Container, Content, Form, Input, Item, Toast, Button} from 'native-base'


class Login extends Component {

    render() {

        return (

            <Container>
                <Content>
                    <Button onPress={() => this.props.navigation.navigate('Home')}>
                        <Text>Home</Text>
                    </Button>
                </Content>
            </Container>

        );
    }
}

export default Login;

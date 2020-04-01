import React, { Component } from "react";
import {Text} from "react-native";
import {Container, Content, Button} from 'native-base'


class Login extends Component {

    render() {

        return (

            <Container>
                <Content>
                    <Button onPress={() => this.props.navigation.navigate('home')}>
                        <Text>Home</Text>
                    </Button>
                </Content>
            </Container>

        );
    }
}

export default Login;

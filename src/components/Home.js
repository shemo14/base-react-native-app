import React, { Component } from "react";
import { Text } from "react-native";
import {
    Container,
    Content,
    Button,
} from 'native-base'


class Home extends Component {
    render() {

        return (
            <Container>
                <Content>
                    <Button onPress={() => this.props.navigation.navigate('login')}>
                        <Text>Login</Text>
                    </Button>
                </Content>
            </Container>

        );
    }
}


export default Home;

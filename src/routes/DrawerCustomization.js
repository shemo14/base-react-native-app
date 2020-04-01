import React, { Component } from "react";
import { Container, Content } from 'native-base';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

class DrawerCustomization extends Component {


    render() {

        return (
            <Container>
                <Content>
					<DrawerContentScrollView {...this.props}>
						<DrawerItemList {...this.props} />
					</DrawerContentScrollView>
                </Content>
            </Container>
        );
    }
}

export default DrawerCustomization;

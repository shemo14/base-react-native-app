import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {Body, Button, Container, Content, Header, Left, Title} from 'native-base'
import styles from '../../assets/style';
import i18n from '../../locale/i18n'
import * as Animatable from 'react-native-animatable';

class ChooseUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner             : false,
        }
    }

    render() {

        return (

            <Container>
                <Header style={[styles.headerView , {justifyContent:"flex-start" , backgroundColor:'transparent'}]}>
                    <TouchableOpacity style={styles.Button} transparent onPress={() => this.props.navigation.navigate('Login')}>
                        <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                    </TouchableOpacity>
                </Header>
                <Content contentContainerStyle={styles.bgFullWidth}>
                    <View style={[styles.position_R, styles.bgFullWidth, styles.flexCenter, styles.Width_100]}>

                        <View style={[styles.overHidden, styles.marginVertical_25, styles.icoImage]}>
                            <Animatable.View animation="bounceIn" easing="ease-out" delay={500} style={[styles.flexCenter]}>
                                <Image style={[styles.icoImage]} source={require('../../assets/img/icon.png')}/>
                            </Animatable.View>
                        </View>

                        <View style={[styles.marginVertical_25]}>

                            <View style={[styles.overHidden]}>
                                <Animatable.View animation="bounceInRight" easing="ease-out" delay={500} style={[styles.flexCenter]}>

                                    <TouchableOpacity
                                        style           = {[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_10, styles.height_40]}
                                        onPress         = {() => this.props.navigation.navigate('Register' , {userType:'user'})}>
                                        <Text style     = {[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                            {i18n.translate('loginUser')}
                                        </Text>
                                    </TouchableOpacity>

                                </Animatable.View>
                            </View>

                            <View style={[styles.overHidden]}>
                                <Animatable.View animation="bounceInLeft" easing="ease-out" delay={700} style={[styles.flexCenter]}>

                                    <TouchableOpacity
                                        style           = {[styles.bg_black, styles.width_150, styles.flexCenter, styles.marginVertical_10, styles.height_40]}
                                        onPress         = {() => this.props.navigation.navigate('Register', {userType:'chef'})}>
                                        <Text style     = {[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                            {i18n.translate('loginchef')}
                                        </Text>
                                    </TouchableOpacity>

                                </Animatable.View>
                            </View>

                        </View>

                    </View>
                    <View style={[styles.shape_logo, styles.position_A, styles.fixItem]}>
                        <Animatable.View animation="fadeIn" easing="ease-out" delay={500}>
                            <Image style={[styles.shape_logo]} source={require('../../assets/img/shape.png')}/>
                        </Animatable.View>
                    </View>
                </Content>

            </Container>

        );
    }
}

export default ChooseUser;

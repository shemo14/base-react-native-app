import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, AsyncStorage, KeyboardAvoidingView} from "react-native";
import {Container, Content, Form, Input, Item, Toast,} from 'native-base'
import styles from '../../assets/style';
import i18n from '../../locale/i18n'
import * as Animatable from 'react-native-animatable';
import {NavigationEvents} from "react-navigation";
import {chooseLang, profile, userLogin} from '../actions'
import {connect} from 'react-redux';
import CONST from '../consts';
import axios from 'axios';

class ActivtionAccount extends Component {
    constructor(props){
        super(props);
        this.state = {
            code                : '',
            deviceId            : '',
            userId              : null,
            type                : 0,
            codeStatus          : 0,
            spinner             : false,
        }
    }

	componentWillMount() {
		const code = this.props.navigation.state.params.code;
		alert(code);
		this.setState({ userId: null })
	}

    activeInput(type) {

        if (type === 'code' || this.state.code !== '') {
            this.setState({codeStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'code' && this.state.code === '') {
            this.setState({codeStatus: 0})
        }

    }

    validate = () => {
        let isError     = false;
        let msg         = '';

        if (this.state.code.length <= 0) {
            isError     = true;
            msg         = i18n.t('codeNot');
        }
        if (msg !== '') {
            Toast.show({
                text        : msg,
                type        : "danger",
                duration    : 3000,
                textStyle       : {
                    color       : "white",
                    fontFamily  : 'cairo',
                    textAlign   : 'center',
                }
            });
        }
        return isError;
    };

	checkCode(){
	    const { token, code, phone, password, deviceId, device_type } = this.props.navigation.state.params;
		if (code == this.state.code){
			this.setState({ isSubmitted: true });


			axios({
				url: CONST.url + 'active-user',
				method   : 'POST',
				headers  : {Authorization: token },
				data     : {lang: this.props.lang}
			}).then(response => {
				AsyncStorage.getItem('deviceID').then(deviceID => {

					this.props.userLogin({phone, password, deviceId , device_type}, this.props.lang)
				})
			})



		}else{
			Toast.show({
				text: i18n.t('codeNotCorrect'),
				type: "danger",
				duration: 3000
			});
		}

	}



	onLoginPressed() {

        this.setState({spinner: true});

        const err = this.validate();

        if (!err){
            this.checkCode();
        }

    }

    componentWillReceiveProps(newProps){
		this.setState({spinner: false});

		if (newProps.auth !== null && newProps.auth.success) {

			if (this.state.userId === null) {
				this.setState({userId: newProps.auth.data.id});
				this.props.profile(newProps.auth.data.token);
			}

			this.props.navigation.navigate('drawerNavigator');

		}

		if (newProps.auth !== null) {
			Toast.show({
				text: newProps.auth.message,
				type: newProps.auth.success ? "success" : "danger",
				duration: 3000,
				textStyle: {
					color: "#fff",
					fontFamily: 'cairo',
					textAlign: 'center',
				}
			});
		}

	}

    render() {

        return (

            <Container>

                <Content contentContainerStyle={styles.bgFullWidth}>
                    <View style={[styles.position_R, styles.bgFullWidth, styles.marginVertical_15, styles.flexCenter, styles.Width_100]}>
                        <View style={[styles.overHidden, styles.marginVertical_15]}>
                            <Animatable.View animation="bounceIn" easing="ease-out" delay={500} style={[styles.flexCenter]}>
                                <Image style={[styles.icoImage]} source={require('../../assets/img/icon.png')}/>
                            </Animatable.View>
                        </View>
                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form style={[styles.Width_100, styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('actcode')}
                                            style={[styles.input, styles.height_50, (this.state.codeStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(code) => this.setState({code})}
                                            onBlur={() => this.unActiveInput('code')}
                                            onFocus={() => this.activeInput('code')}
                                            keyboardType={'number-pad'}
                                        />
                                    </Item>
                                </View>

                                <TouchableOpacity
                                    style={[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40, styles.zIndex]}
                                    onPress={() => this.onLoginPressed()}>
                                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                        {i18n.translate('doHaveAcc')}
                                    </Text>
                                </TouchableOpacity>

                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                    <View style={[styles.shape_logo, styles.position_A, styles.fixItem, styles.zIndexDown]}>
                        <Animatable.View animation="fadeIn" easing="ease-out" delay={500}>
                            <Image style={[styles.shape_logo]} source={require('../../assets/img/shape.png')}/>
                        </Animatable.View>
                    </View>
                </Content>

            </Container>

        );
    }
}


const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        loading     : auth.loading,
        auth        : auth.user,
        user        : profile.user,
        lang        : lang.lang
    };
};
export default connect(mapStateToProps, { userLogin, profile })(ActivtionAccount);

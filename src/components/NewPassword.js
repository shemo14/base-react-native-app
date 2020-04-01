import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, AsyncStorage, KeyboardAvoidingView} from "react-native";
import {Container, Content, Form, Input, Item, Toast,} from 'native-base'
import styles from '../../assets/style';
import i18n from '../../locale/i18n'
import * as Animatable from 'react-native-animatable';
import {NavigationEvents} from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import axios from 'axios';
import CONST from "../consts";


class NewPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            code                   : '',
            oldPassword            : '',
            newPassword            : '',
            deviceId               : '',
            userId                 : null,
            type                   : 0,
            codeStatus             : 0,
            oldPasswordStatus      : 0,
            newPasswordStatus      : 0,
            spinner                : false,
        }
    }

    activeInput(type) {

        if (type === 'code' || this.state.code !== '') {
            this.setState({codeStatus: 1})
        }

        if (type === 'oldPassword' || this.state.oldPassword !== '') {
            this.setState({oldPasswordStatus: 1})
        }

        if (type === 'newPassword' || this.state.newPassword !== '') {
            this.setState({newPasswordStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'code' && this.state.code === '') {
            this.setState({codeStatus: 0})
        }

        if (type === 'oldPassword' && this.state.oldPassword === '') {
            this.setState({oldPasswordStatus: 0})
        }

        if (type === 'newPassword' && this.state.newPassword === '') {
            this.setState({newPasswordStatus: 0})
        }

    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.code.length <= 0) {
            isError     = true;
            msg         = i18n.t('codeN');
        }else if (this.state.oldPassword.length <= 0){
            isError     = true;
            msg         = i18n.translate('newmpass');
        }else if (this.state.oldPassword.length < 6){
            isError     = true;
            msg         = i18n.translate('passreq');
        }else if (this.state.oldPassword !== this.state.newPassword){
            isError     = true;
            msg         = i18n.translate('notmatch');
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

    onLoginPressed() {

        this.setState({spinner: true});

        const err = this.validate();

        // if (!err){
        //     const {phone, password, deviceId , type} = this.state;
        //     this.props.userLogin({ phone, password, deviceId, type }, this.props.lang);
        // }

    }

	componentWillMount() {
		const {code} = this.props.navigation.state.params;
		alert(code);
	}

	renewPassword() {
		if(this.state.oldPassword !== this.state.newPassword){
			Toast.show({
				text: i18n.t('verifyPassword'),
				type: "danger",
				duration: 3000
			});
			return false
		}

		const { code, token } = this.props.navigation.state.params;
		this.setState({spinner: true});

		axios({
			url: CONST.url + 'reset-password',
			method   : 'POST',
			headers  : {Authorization: token },
			data     : {lang: this.props.lang, password: this.state.oldPassword, code}
		}).then(response => {
			this.setState({spinner: false});

			if (response.data.success)
				this.props.navigation.navigate("Login");

			Toast.show({
				text: response.data.message,
				type: response.data.success ? "success" :"danger",
				duration: 3000
			});
		});
	}


	onFocus(){
        this.componentWillMount();
    }

    render() {

        return (

            <Container>
				<Spinner visible={this.state.spinner} />

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Content contentContainerStyle={styles.bgFullWidth}>
                    <View style={[styles.position_R, styles.bgFullWidth, styles.marginVertical_15, styles.flexCenter, styles.Width_100]}>
                        <View style={[styles.overHidden, styles.marginVertical_15]}>
                            <Animatable.View animation="bounceIn" easing="ease-out" delay={500} style={[styles.flexCenter]}>
                                <Image style={[styles.icoImage]} source={require('../../assets/img/icon.png')}/>
                            </Animatable.View>
                        </View>
                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form style={[styles.Width_100, styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>

                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('code')}
                                            style={[styles.input, styles.height_50, (this.state.codeStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(code) => this.setState({code})}
                                            onBlur={() => this.unActiveInput('code')}
                                            onFocus={() => this.activeInput('code')}
                                            keyboardType={'number-pad'}
                                        />
                                    </Item>
                                </View>

                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('newpass')}
                                            style={[styles.input, styles.height_50, (this.state.oldPasswordStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(oldPassword) => this.setState({oldPassword})}
                                            onBlur={() => this.unActiveInput('oldPassword')}
                                            onFocus={() => this.activeInput('oldPassword')}
                                            secureTextEntry
                                        />
                                    </Item>
                                </View>

                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('confirmpass')}
                                            style={[styles.input, styles.height_50, (this.state.newPasswordStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(newPassword) => this.setState({newPassword})}
                                            onBlur={() => this.unActiveInput('newPassword')}
                                            onFocus={() => this.activeInput('newPassword')}
                                            secureTextEntry
                                        />
                                    </Item>
                                </View>

                                <TouchableOpacity
                                    style={[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40, styles.zIndex]}
                                    onPress={() => this.renewPassword()}>
                                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                        {i18n.translate('confirm')}
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

export default NewPassword;

// const mapStateToProps = ({ auth, profile, lang }) => {
//     return {
//         loading     : auth.loading,
//         auth        : auth.user,
//         user        : profile.user,
//         lang        : lang.lang
//     };
// };
// export default connect(mapStateToProps, {  })(Login);

import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ScrollView , ActivityIndicator} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Title, Right, Icon, CheckBox, Toast, Form, Item, Input
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getChangePassword} from "../actions";
import * as Animatable from 'react-native-animatable';
import Modal from "react-native-modal";
import COLORS from '../../src/consts/colors'

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                     : false,
            isModalPassword             : false,
            oldPassword                 : '',
            newPassword                 : '',
            confirmPassword             : '',
            oldStatus                   : 0,
            newStatus                   : 0,
            confirmStatus               : 0,
            Error                       : '',
            birthday                    : '',
            isSubmitted                     : false,
            messageError                    : ''
        }
    }
    componentWillMount() {
        this.setState({ messageError: '', isSubmitted: false });
    }

    activeInput(type) {

        if (type === 'oldPassword' || this.state.oldPassword !== '') {
            this.setState({oldStatus: 1})
        }

        if (type === 'newPassword' || this.state.newPassword !== '') {
            this.setState({newStatus: 1})
        }

        if (type === 'confirmPassword' || this.state.confirmPassword !== '') {
            this.setState({confirmStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'oldPassword' && this.state.oldPassword === '') {
            this.setState({oldStatus: 0})
        }

        if (type === 'newPassword' && this.state.newPassword === '') {
            this.setState({newStatus: 0})
        }

        if (type === 'confirmPassword' && this.state.confirmPassword === '') {
            this.setState({confirmStatus: 0})
        }

    }


    toggleModalPassword = () => {
        this.setState({
            isModalPassword: !this.state.isModalPassword,
            oldPassword                 : '',
            newPassword                 : '',
            confirmPassword             : '',
            oldStatus                   : 0,
            newStatus                   : 0,
            confirmStatus               : 0,
            messageError                : ''
        });
    };

    renderSubmit(){
        if (this.state.oldPassword == '' || this.state.newPassword == '' || this.state.confirmPassword == '') {
            return (
                <View style={[styles.Width_100,{marginBottom:20}]}>
                    <TouchableOpacity style={[styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red, , {backgroundColor:'#999'}]}>
                        <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                            { i18n.t('confirm') }
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if (this.state.isSubmitted) {
            return (
                <View style={[{justifyContent: 'center', alignItems: 'center' , margin:20}]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            )
        }
        return (
            <TouchableOpacity
                style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,]}
                onPress     = {() => this.savePassword()}
            >
                <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                    { i18n.t('confirm') }
                </Text>
            </TouchableOpacity>


        );
    }

    savePassword(){

        this.setState({ massegeError : this.props.massage });

        if (this.state.newPassword.length < 6){
            this.setState({ messageError    : i18n.t('passreq') });
            return false
        }
        if(this.state.newPassword !== this.state.confirmPassword){
            this.setState({ messageError    : i18n.t('passError') });
            return false
        }

        this.setState({ isSubmitted: true, });
        this.props.getChangePassword( this.props.lang ,
            this.state.oldPassword,
            this.state.newPassword,
            this.props.user.token
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ messageError: nextProps.message, isSubmitted: false , isModalPassword:false,});

        // if (nextProps.changePassword) {
        //     alert('o')
        //     this.setState({isSubmitted: false , isModalPassword:false, messageError: ''});
        // }
    }


    static navigationOptions = () => ({
        header          : null,
        drawerLabel     : (<Text style={[styles.textRegular, styles.textSize_16]}>{i18n.translate('myAcc')}</Text>) ,
        drawerIcon      : (<Image style={[styles.headImage]} source={require('../../assets/img/user.png')} resizeMode={'contain'}/>)
    });

    render() {

        return (
            <Container>

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('myAcc') }
                        </Title>
                    </Body>
                    <Right>
                        <Button style={styles.Button} transparent onPress = {() => this.props.navigation.navigate('EditProfile')}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/edit.png')} resizeMode={'contain'}/>
                        </Button>
                    </Right>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10, styles.paddingHorizontal_10]}>

                        <View>
                            <View style={[ styles.overHidden,styles.Width_85, styles.height_200, styles.flexCenter]}>
                                <Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[ styles.overHidden,styles.Width_100, styles.height_200, styles.flexCenter]}>
                                    <Image style={[styles.Width_100, styles.height_200]} source={{uri:this.props.user.avatar}}/>
                                </Animatable.View>
                            </View>
                            <Text style = {[styles.textRegular, styles.text_black, styles.textSize_16, styles.textCenter, styles.marginVertical_10]}>{ this.props.user.name }</Text>
                        </View>

                        <View style={[ styles.marginVertical_10, styles.Width_85, styles.flexCenter ]}>

                            <View style={[ styles.marginVertical_10 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_red]}>
                                <Text style={[styles.textRegular, styles.textSize_13, styles.text_black]}>
                                    { this.props.user.phone }
                                </Text>
                            </View>

                            <View style={[ styles.marginVertical_10 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_red]}>
                                <Text style={[styles.textRegular, styles.textSize_13, styles.text_black]}>
                                    { this.props.user.gender }
                                </Text>
                            </View>

                            {
                                this.props.user != null && this.props.user.type === 'provider' ?
                                    <View style={[ styles.marginVertical_10 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_red]}>
                                        <Text style={[styles.textRegular, styles.textSize_13, styles.text_black]}>
                                            { this.props.user.birthday }
                                        </Text>
                                        <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='calendar' />
                                    </View>
                                    :
                                    null
                            }

                            {
                                this.props.user != null && this.props.user.type === 'provider' ?
                                    <View style={[ styles.marginVertical_10 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_red]}>
                                        <Text style={[styles.textRegular, styles.textSize_13, styles.text_black]}>
                                            { this.props.user.qualification }
                                        </Text>
                                    </View>
                                    :
                                    null
                            }


                            <View style={[ styles.marginVertical_10 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_red]}>
                                <Text style={[styles.textRegular, styles.textSize_13, styles.text_black]}>
                                    { this.props.user.country }
                                </Text>
                            </View>

                            <View style={[ styles.marginVertical_10 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_red]}>
                                <Text style={[styles.textRegular, styles.textSize_13, styles.text_black]}>
                                    { (this.props.user.address).substr(0,35) }
                                </Text>
                                <Icon style={[styles.textSize_14, styles.text_light_gray]} type="Feather" name='map-pin' />
                            </View>
                            {
                                this.props.user != null && this.props.user.type === 'provider' ?
                                    <View style={styles.Width_100}>
                                        <Text style={[styles.textRegular, styles.textSize_13, styles.text_black , styles.marginVertical_15, styles.Width_100 , {alignSelf:'flex-start'}]}>
                                            { i18n.t('delver') }
                                        </Text>
                                        <View style={[ styles.height_40 ]}>
                                            <ScrollView style={[ styles.scroll ]} horizontal={true} showsHorizontalScrollIndicator={false}>

                                                {
                                                    this.props.user.delivery_types.map((type, i) => (
                                                        <View
                                                            key={i}
                                                            style           = {[ styles.paddingHorizontal_25, styles.paddingVertical_5, styles.flexCenter, styles.marginVertical_5, styles.marginHorizontal_5, styles.bg_black ]}>
                                                            <Text style     = {[ styles.textRegular, styles.textSize_12 , styles.text_White ]} >
                                                                {type.name}
                                                            </Text>
                                                        </View>
                                                    ))
                                                }

                                            </ScrollView>
                                        </View>
                                    </View>
                                    :null
                            }

                            <TouchableOpacity
                                style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter,]}
                                onPress     = {() => this.toggleModalPassword()}
                            >
                                <Text style={[styles.textRegular, styles.textSize_16, styles.text_red, styles.textDecoration]}>
                                    { i18n.t('changepass') }
                                </Text>
                            </TouchableOpacity>

                            <Modal isVisible={this.state.isModalPassword} onBackdropPress={() => this.toggleModalPassword()} style={[ styles.bottomCenter, styles.Width_100 ]}>
                                <View style={[styles.overHidden, styles.bg_White, styles.Width_100, styles.position_R, styles.top_20]}>

                                    <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                                        <View style={[ styles.marginVertical_5 ]}>
                                            <Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textCenter]}>{ i18n.t('changepass') }</Text>
                                        </View>

                                        <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>

                                            <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                                <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                                    <Input
                                                        placeholder={i18n.translate('currentpass')}
                                                        style={[styles.input, styles.height_50, (this.state.oldStatus === 1 ? styles.Active : styles.noActive)]}
                                                        onChangeText={(oldPassword) => this.setState({oldPassword})}
                                                        onBlur={() => this.unActiveInput('oldPassword')}
                                                        onFocus={() => this.activeInput('oldPassword')}
                                                        value                   = {this.state.oldPassword}
                                                        secureTextEntry
                                                    />
                                                </Item>
                                            </View>

                                            <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                                <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                                    <Input
                                                        placeholder={i18n.translate('newpass')}
                                                        style={[styles.input, styles.height_50, (this.state.newStatus === 1 ? styles.Active : styles.noActive)]}
                                                        onChangeText={(newPassword) => this.setState({newPassword})}
                                                        onBlur={() => this.unActiveInput('newPassword')}
                                                        onFocus={() => this.activeInput('newPassword')}
                                                        value                   = {this.state.newPassword}
                                                        secureTextEntry
                                                    />
                                                </Item>
                                            </View>

                                            <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                                <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                                    <Input
                                                        placeholder={i18n.translate('confirmpass')}
                                                        style={[styles.input, styles.height_50, (this.state.confirmStatus === 1 ? styles.Active : styles.noActive)]}
                                                        onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                                                        onBlur={() => this.unActiveInput('confirmPassword')}
                                                        onFocus={() => this.activeInput('confirmPassword')}
                                                        value                   = {this.state.confirmPassword}
                                                        secureTextEntry
                                                    />
                                                </Item>
                                            </View>

                                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_red, styles.textCenter]}>{ this.state.messageError }</Text>



                                            {
                                                this.renderSubmit()
                                            }

                                        </Form>

                                    </View>

                                </View>
                            </Modal>

                        </View>

                    </View>

                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({ lang  , profile , changePassword}) => {
    return {
        lang                    : lang.lang,
        user                    : profile.user,
        changePassword          : changePassword.changePassword,
        message                 : changePassword.message
    };
};
export default connect(mapStateToProps, {getChangePassword})(Profile);

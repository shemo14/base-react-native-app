import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, KeyboardAvoidingView , ActivityIndicator} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Title, Form, Item, Input, Label, Toast, Icon, CheckBox
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {addBankAcoounts , getBanks} from "../actions";
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Modal from "react-native-modal";
import COLORS from "../consts/colors";

class FormBank extends Component {
    constructor(props){
        super(props);
        this.state = {
            numAcc                      : '',
            nationalId                  : '',
            IBANNo                  : '',
            photo                       : '',
            numAccStatus                : 0,
            IBANNoStatus            : 0,
            photoStatus                 : 0,
            bankId                      : null,
            bank                        : i18n.t('namebank'),
            eventImg                    : i18n.translate('nationalImg'),
            base64                      : '',
            isSubmitted: false,
        }
    }

    activeInput(type) {

        if (type === 'numAcc' || this.state.numAcc !== '') {
            this.setState({numAccStatus: 1})
        }

        if (type === 'nationalId' || this.state.nationalId !== '') {
            this.setState({nationalIdStatus: 1})
        }

        if (type === 'IBANNo' || this.state.IBANNo !== '') {
            this.setState({IBANNoStatus: 1})
        }

        if (type === 'photo' || this.state.photo !== '') {
            this.setState({photoStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'numAcc' && this.state.numAcc === '') {
            this.setState({numAccStatus: 0})
        }

        if (type === 'nationalId' && this.state.nationalId === '') {
            this.setState({nationalIdStatus: 0})
        }

        if (type === 'IBANNo' && this.state.IBANNo === '') {
            this.setState({IBANNoStatus: 0})
        }

        if (type === 'photo' && this.state.photo === '') {
            this.setState({photoStatus: 0})
        }

    }
    //
    // validate = () => {
    //     let isError     = false;
    //     let msg         = '';
    //
    //     if (this.state.bankId === null) {
    //         isError     = true;
    //         msg         = i18n.t('enterbank');
    //     } else if (this.state.numAcc === '') {
    //         isError     = true;
    //         msg         = i18n.t('enternumAcc');
    //     } else if (this.state.nationalId === '') {
    //         isError     = true;
    //         msg         = i18n.t('enternationalId');
    //     }else if (this.state.IBANNo === '') {
    //         isError     = true;
    //         msg         = i18n.t('enterIBANNo');
    //     } else if (this.state.base64 === '') {
    //         isError     = true;
    //         msg         = i18n.t('enterpicture');
    //     }
    //     if (msg !== '') {
    //         Toast.show({
    //             text        : msg,
    //             type        : "danger",
    //             duration    : 3000,
    //             textStyle       : {
    //                 color       : "white",
    //                 fontFamily  : 'cairo',
    //                 textAlign   : 'center',
    //             }
    //         });
    //     }
    //     return isError;
    // };
    onLoginPressed() {

        this.setState({ isSubmitted: true });
        this.props.addBankAcoounts(this.state.nationalId , this.state.base64 , this.state.numAcc , this.state.IBANNo , this.state.bankId , this.props,  this.props.lang , this.props.user.token );
    }

    renderAddAcc(){
        if (this.state.bankId === null || this.state.numAcc == '' || this.state.nationalId == '' || this.state.IBANNo == ''|| this.state.base64 == ''){
            return (
                <View
                    style={[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40 , {backgroundColor:"#999"}]}>
                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                        {i18n.translate('confirm')}
                    </Text>
                </View>
            );
        }
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginVertical_15]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity
                style={[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40]}
                onPress={() => this.onLoginPressed()}>
                <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                    {i18n.translate('confirm')}
                </Text>
            </TouchableOpacity>
        );
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isSubmitted: false});

    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    _pickImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64:true
        });

        if (!result.cancelled) {
            this.setState({ eventImg: result.uri ,base64:result.base64});
        }
    };

    toggleModalBank = () => {
        this.setState({ isModalBank: !this.state.isModalBank});
    };

    selectBankId(id, name) {
        this.setState({
            bankId       : id,
            bank         : name
        });
        this.setState({ isModalBank: !this.state.isModalBank});
    }

    componentWillMount() {
        this.setState({ isSubmitted: false });
        this.props.getBanks(this.props.lang )
    }

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
                            { i18n.t('thebank') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_30, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , {marginTop:50}]}>

                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>

                                <Form style={[styles.flexCenter, styles.Width_90]}>

                                    <View style={[styles.position_R, styles.overHidden, styles.flexCenter]}>

                                        <View style={[styles.overHidden, styles.rowGroup]}>
                                            <TouchableOpacity onPress={() => this.toggleModalBank()} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, (this.state.bankId !== null ? styles.border_red :  styles.border_gray )]}>
                                                <Text style={[styles.textRegular, styles.textSize_14, (this.state.bankId !== null ? styles.text_red :  styles.text_black )]}>
                                                    { this.state.bank }
                                                </Text>
                                                <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='down' />
                                            </TouchableOpacity>
                                        </View>

                                        <Modal isVisible={this.state.isModalBank} onBackdropPress={() => this.toggleModalBank()}>
                                            <View style={[styles.overHidden, styles.bg_White, styles.Radius_5]}>

                                                <View style={[styles.Border, styles.border_gray, styles.paddingVertical_15]}>
                                                    <Text style={[styles.textRegular, styles.text_black, styles.textSize_14, styles.textLeft , styles.SelfCenter]}>
                                                        {i18n.t('namebank')}
                                                    </Text>
                                                </View>

                                                <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
                                                    {
                                                        this.props.banks.map((bank, i ) => {
                                                            return(
                                                                <TouchableOpacity
                                                                    key={i}
                                                                    style               = {[styles.rowGroup, styles.marginVertical_10]}
                                                                    onPress             = {() => this.selectBankId(bank.id, bank.name)}
                                                                >
                                                                    <View style={[styles.overHidden, styles.rowRight]}>
                                                                        <CheckBox
                                                                            style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
                                                                            color               = {styles.text_red}
                                                                            selectedColor       = {styles.text_red}
                                                                            checked             = {this.state.bankId === 1}
                                                                        />
                                                                        <Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                            {bank.name}
                                                                        </Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                    }

                                                </View>

                                            </View>
                                        </Modal>

                                        <View>
                                            <Text style={[styles.label , styles.textRegular , styles.text_black, styles.textSize_14, styles.position_A, styles.left_0 , styles.bg_White, styles.paddingVertical_5, styles.paddingHorizontal_10 ,(this.state.nationalIdStatus === 1 ? { top : 2 , zIndex : 99 } : { top : 25 , zIndex : -1 })]}>
                                                {i18n.translate('nationalId')}
                                            </Text>
                                            <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                                <Input
                                                    style={[styles.input, styles.height_50, (this.state.nationalIdStatus === 1 ? styles.Active : styles.noActive)]}
                                                    onChangeText={(nationalId) => this.setState({nationalId})}
                                                    onBlur={() => this.unActiveInput('nationalId')}
                                                    onFocus={() => this.activeInput('nationalId')}
                                                />
                                            </Item>
                                        </View>

                                        <View>
                                            <Text style={[styles.label , styles.textRegular , styles.text_black, styles.textSize_14, styles.position_A, styles.left_0 , styles.bg_White, styles.paddingVertical_5, styles.paddingHorizontal_10 ,(this.state.IBANNoStatus === 1 ? { top : 2 , zIndex : 99 } : { top : 25 , zIndex : -1 })]}>
                                                {i18n.translate('IBANNo')}
                                            </Text>
                                            <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                                <Input
                                                    style={[styles.input, styles.height_50, (this.state.IBANNoStatus === 1 ? styles.Active : styles.noActive)]}
                                                    onChangeText={(IBANNo) => this.setState({IBANNo})}
                                                    onBlur={() => this.unActiveInput('IBANNo')}
                                                    onFocus={() => this.activeInput('IBANNo')}
                                                />
                                            </Item>
                                        </View>

                                        <View>
                                            <Text style={[styles.label , styles.textRegular , styles.text_black, styles.textSize_14, styles.position_A, styles.left_0 , styles.bg_White, styles.paddingVertical_5, styles.paddingHorizontal_10 ,(this.state.numAccStatus === 1 ? { top : 2 , zIndex : 99 } : { top : 25 , zIndex : -1 })]}>
                                                {i18n.translate('acountnumber')}
                                            </Text>
                                            <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                                <Input
                                                    style={[styles.input, styles.height_50, (this.state.numAccStatus === 1 ? styles.Active : styles.noActive)]}
                                                    onChangeText={(numAcc) => this.setState({numAcc})}
                                                    onBlur={() => this.unActiveInput('numAcc')}
                                                    onFocus={() => this.activeInput('numAcc')}
                                                />
                                            </Item>
                                        </View>

                                    </View>
                                    <View style={[ styles.rowGroup, styles.Width_100, styles.marginVertical_10 ]}>
                                        <Text style={[styles.label , styles.textRegular , styles.text_black, styles.textSize_14, ]}>
                                            {i18n.translate('nationalImg')}
                                        </Text>
                                        <TouchableOpacity
                                            style={[ styles.flex_60 , styles.rowGroup, styles.Border, styles.border_gray, styles.paddingHorizontal_10, styles.paddingVertical_10 ]}
                                            onPress={this._pickImage}>
                                            <Text style={[styles.label , styles.textRegular , styles.text_black_gray, styles.textSize_14, styles.width_100]} numberOfLines = { 1 } prop with ellipsizeMode = "tail">
                                                { this.state.eventImg }
                                            </Text>
                                            <Icon style={[styles.textSize_20, styles.text_black_gray]} type="Feather" name='camera' />
                                        </TouchableOpacity>
                                    </View>
                                </Form>

                                {this.renderAddAcc()}

                            </KeyboardAvoidingView>


                    </View>

                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({lang , profile , banks}) => {
    return {
        lang: lang.lang,
        user: profile.user,
        banks: banks.banks,
    };
};
export default connect(mapStateToProps, {addBankAcoounts , getBanks})(FormBank);

import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator,} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Title, Form, Item, Input, Toast,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getOrderStore} from "../actions";
import * as Animatable from 'react-native-animatable';
import DateTimePicker from "react-native-modal-datetime-picker";
import COLORS from "../consts/colors";

class FormPayment extends Component {
    constructor(props){
        super(props);
        this.state = {
            name                        : '',
            number                      : '',
            timeDate                    : '',
            code                        : '',
            date                        : '',
            nameStatus                  : 0,
            numberStatus                : 0,
            timeDateStatus              : 0,
            codeStatus                  : 0,
            isDatePickerVisible         : false,
            spinner                     : false,
            isSubmitted: false,

        }
    }

    activeInput(type) {

        if (type === 'name' || this.state.name !== '') {
            this.setState({nameStatus: 1})
        }

        if (type === 'number' || this.state.number !== '') {
            this.setState({numberStatus: 1})
        }

        if (type === 'timeDate' || this.state.timeDate !== '') {
            this.setState({timeDateStatus: 1})
        }

        if (type === 'code' || this.state.code !== '') {
            this.setState({codeStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'name' && this.state.name === '') {
            this.setState({nameStatus: 0})
        }

        if (type === 'number' && this.state.number === '') {
            this.setState({numberStatus: 0})
        }

        if (type === 'timeDate' && this.state.timeDate === '') {
            this.setState({timeDateStatus: 0})
        }

        if (type === 'code' && this.state.code === '') {
            this.setState({codeStatus: 0})
        }

    }



    toggleDatePicker = () => {
        this.setState({ isDatePickerVisible: !this.state.isDatePickerVisible });
    };

    doneDatePicker = date => {
        let formatted_date = date.getFullYear() + "-" + ("0"+(date.getMonth() + 1)).slice(-2) + "-" + ("0" +date.getDate()).slice(-2);
        this.setState({ date : formatted_date, isDatePickerVisible: false });
    };

    componentWillMount() {

        this.setState({ isSubmitted: false });

    }

    renderStoreOrder(){
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginVertical_15]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity
                style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,]}
                onPress     = {() => this.onPayPressed()}
            >
                <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                    { i18n.t('confirm') }
                </Text>
            </TouchableOpacity>
        );
    }
    onPayPressed() {

        this.setState({ isSubmitted: true });
        const latitude                = this.props.navigation.state.params.latitude;
        const longitude               = this.props.navigation.state.params.longitude;
        const provider_id             = this.props.navigation.state.params.provider_id;
        const delivery_type           = this.props.navigation.state.params.delivery_type;


        this.props.getOrderStore(this.props.lang, provider_id , delivery_type , latitude , longitude , this.props.user.token  , this.props )

    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isSubmitted: false});

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
                            { i18n.t('pay') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_60, styles.right_0, styles.top_0 ]}/>

                    <View style={[ styles.paddingHorizontal_5, styles.marginHorizontal_15, styles.position_R , { top : -40 }]}>

                        <View style={[styles.overHidden, styles.marginVertical_5]}>
                            <Animatable.View animation="bounceIn" easing="ease-out" delay={500} style={[styles.flexCenter]}>
                                <Image style={[styles.shape_logo]} source={require('../../assets/img/layout.png')}/>
                            </Animatable.View>
                        </View>
                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('userName')}
                                            style={[styles.input, styles.height_50, (this.state.nameStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(name) => this.setState({name})}
                                            onBlur={() => this.unActiveInput('name')}
                                            onFocus={() => this.activeInput('name')}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('accNum')}
                                            style={[styles.input, styles.height_50, (this.state.numberStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(number) => this.setState({number})}
                                            onBlur={() => this.unActiveInput('number')}
                                            onFocus={() => this.activeInput('number')}
                                            keyboardType={'number-pad'}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.overHidden, styles.rowGroup]}>
                                    <TouchableOpacity onPress={this.toggleDatePicker} style={[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, (this.state.date !== '' ? styles.border_red :  styles.border_gray )]}>
                                        <Text style={[styles.textRegular, styles.textSize_14, (this.state.date !== '' ? styles.text_red :  styles.text_black )]}>
                                            {i18n.translate('finishDate')} : {this.state.date}
                                        </Text>
                                        <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='calendar' />
                                    </TouchableOpacity>
                                </View>

                                <DateTimePicker
                                    isVisible       = {this.state.isDatePickerVisible}
                                    onConfirm       = {this.doneDatePicker}
                                    onCancel        = {this.toggleDatePicker}
                                    mode            = {'date'}
                                    minimumDate     = {new Date()}
                                />

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('confirmCode')}
                                            style={[styles.input, styles.height_50, (this.state.codeStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(code) => this.setState({code})}
                                            onBlur={() => this.unActiveInput('code')}
                                            onFocus={() => this.activeInput('code')}
                                            keyboardType={'number-pad'}
                                        />
                                    </Item>
                                </View>

                                {
                                    this.renderStoreOrder()
                                }


                            </Form>
                        </KeyboardAvoidingView>
                    </View>

                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({lang , profile}) => {
    return {
        lang: lang.lang,
        user: profile.user,
    };
};
export default connect(mapStateToProps, {getOrderStore })(FormPayment);

import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, FlatList,} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Title, CheckBox,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {changeOrderStatus} from "../actions";
import * as Animatable from 'react-native-animatable';
import Modal from "react-native-modal";

class Payment extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                     : false,
            count                       : 0,
            delivery                    : i18n.t('delver'),
            deliveryId                  : null,
            isModalDelivery             : false,
            active                      : 1,
            isSubmitted: false,
        }
    }

    componentWillMount(){
        this.setState({isSubmitted: false});

    }
    componentWillReceiveProps(nextProps) {
        this.setState({isSubmitted: false});
    }
    getPayment(id){
        if(this.props.navigation.state.params.fromNav){
            this.setState({isSubmitted: true});
            this.props.changeOrderStatus(this.props.lang, this.props.navigation.state.params.order_id ,3 ,null , 'online' , this.props.user.token , this.props )
        }else {
            this.props.navigation.navigate('FormPayment', {
                paymentId : id,
                latitude                : this.props.navigation.state.params.latitude,
                longitude               : this.props.navigation.state.params.longitude,
                provider_id             : this.props.navigation.state.params.provider_id,
                delivery_type           : this.props.navigation.state.params.delivery_type,
            });
        }
    }

    choosePay ( id ){
        this.setState({ active : id });
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

                    <View style={[ styles.position_R, styles.bg_gray, styles.Width_100, styles.height_60, styles.right_0, styles.top_0 ]}/>

                    <View style={[ styles.marginVertical_20, styles.paddingHorizontal_5, styles.marginHorizontal_15]}>

                        <TouchableOpacity
                            style           = {[ styles.marginVertical_5, styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.SelfLeft, styles.bg_White, styles.Border, styles.Width_100, (this.state.active === 1 ? styles.border_red : styles.border_gray)]}
                            onPress         = {() => this.choosePay(1)}
                        >
                            <Image style={[styles.iconBank, styles.marginHorizontal_10]} source={require('../../assets/img/credit_card.png')} resizeMode={'contain'}/>
                            <Text style={[styles.textRegular, styles.textSize_13, styles.marginHorizontal_5, (this.state.active === 1 ? styles.text_red : styles.text_light_gray)]}>
                                { i18n.t('visa') }
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style           = {[ styles.marginVertical_5, styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.SelfLeft, styles.bg_White, styles.Border, styles.Width_100, (this.state.active === 2 ? styles.border_red : styles.border_gray)]}
                            onPress         = {() => this.choosePay(2)}
                        >
                            <Image style={[styles.iconBank, styles.marginHorizontal_10]} source={require('../../assets/img/sadad_logo.png')} resizeMode={'contain'}/>
                            <Text style={[styles.textRegular, styles.textSize_13, styles.marginHorizontal_5, (this.state.active === 2 ? styles.text_red : styles.text_light_gray)]}>
                                { i18n.t('sdad') }
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style           = {[ styles.marginVertical_5, styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.SelfLeft, styles.bg_White, styles.Border, styles.Width_100, (this.state.active === 3 ? styles.border_red : styles.border_gray)]}
                            onPress         = {() => this.choosePay(3)}
                        >
                            <Image style={[styles.iconBank, styles.marginHorizontal_10]} source={require('../../assets/img/mada_logo.png')} resizeMode={'contain'}/>
                            <Text style={[styles.textRegular, styles.textSize_13, styles.marginHorizontal_5, (this.state.active === 3 ? styles.text_red : styles.text_light_gray)]}>
                                { i18n.t('mada') }
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,]}
                            onPress     = {() => this.getPayment()}
                        >
                            <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                { i18n.t('choose') }
                            </Text>
                        </TouchableOpacity>

                    </View>

                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
    };
};
export default connect(mapStateToProps, {changeOrderStatus})(Payment);

import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView,} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Title, CheckBox, Toast,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getCartInfo , getDeliveryTypes} from "../actions";
import * as Animatable from 'react-native-animatable';
import Modal from "react-native-modal";
import COLORS from "../consts/colors";
import {NavigationEvents} from "react-navigation";
import CartItem from './CartItem'

let cartItems = [];

class DetailsCart extends Component {
    constructor(props){
        super(props);
        this.state = {
            loader                      : true,
            count                       : 1,
            delivery                    : i18n.t('delver'),
            deliveryId                  : null,
            isModalDelivery             : false,
            totalPrice: 0,

        }
    }

    componentWillMount() {
        cartItems   = [];
        this.setState({ totalPrice: 0 , loader: true});
        const provider_id = this.props.navigation.state.params.provider_id;
        this.props.getCartInfo(this.props.lang , provider_id , this.props.user.token);
        this.props.getDeliveryTypes(this.props.lang);
    }
    renderLoader(){
        if (this.state.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }
    pushCartItems(cart_id , price){
        if (cartItems.includes(cart_id) === false) {
            cartItems.push(cart_id);
            const totalPrice = Number(this.state.totalPrice) + Number(price);
            setTimeout(() => this.setState({ totalPrice }), 0)
        }

        console.log('selected items_', cartItems , 'current total price ' , this.state.totalPrice);
    }

    pullCartItems(cart_id , price){
        for( var i = 0; i < cartItems.length; i++){
            if ( cartItems[i] === cart_id) {
                cartItems.splice(i, 1);
                const totalPrice = Number(this.state.totalPrice) - Number(price);
                setTimeout(() => this.setState({ totalPrice }), 0)
            }
        }

        console.log('selected items_', cartItems , 'current total price ' ,this.state.totalPrice );
    }

    toggleModalDelivery = () => {
        this.setState({ isModalDelivery: !this.state.isModalDelivery});
    };

    selectDeliveryId(id, name) {
        this.setState({
            deliveryId      : id,
            delivery        : name
        });
        this.setState({ isModalDelivery: !this.state.isModalDelivery});
    }

    getLocation(){
    this.state.deliveryId?
        this.props.navigation.navigate('MapLocation', {
            pageName : this.props.navigation.state.routeName,
            provider_id: this.props.navigation.state.params.provider_id,
            delivery_type: this.state.deliveryId,
        })
    :
        Toast.show({
            text: i18n.t('chooseType'),
            type: "danger",
            duration: 3000,
            textStyle: {
                color: "white",
                fontFamily: 'cairo',
                textAlign: 'center',
            }
        });

    }

    componentWillReceiveProps(nextProps) {
        this.setState({loader: false});
        if (nextProps.cartInfo)
            this.setState({ totalPrice: nextProps.cartInfo.price });
    }

    _keyExtractor = (item, index) => item.id;

    renderItems = (item, key) => {
        const providerId = this.props.navigation.state.params.provider_id;
        return(
            <CartItem item={item} pushItem={(cart_id, price) => this.pushCartItems(cart_id, price)} pullItem={(cart_id, price) => this.pullCartItems(cart_id, price)} key={key} providerId={providerId} navigation={this.props.navigation} />
        );
    };
    onFocus() {
        this.componentWillMount();
    }
    render() {

        return (
            <Container>
                { this.renderLoader() }
                <NavigationEvents onWillFocus={() => this.onFocus()}/>
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('basket') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_80, styles.right_0, styles.top_0 ]}/>
                    {
                        this.props.cartInfo ?
                            <View>
                                <View style={[ styles.rowGroup, styles.paddingHorizontal_10, styles.marginVertical_10, styles.overHidden, styles.Width_100 ]}>

                                    <FlatList
                                        data={this.props.cartInfo.meals}
                                        renderItem={({item}) => this.renderItems(item)}
                                        numColumns={2}
                                        keyExtractor={this._keyExtractor}
                                        columnWrapperStyle={{ justifyContent:'space-between'}}
                                    />

                                </View>

                                <View style={[ styles.marginVertical_10, styles.paddingHorizontal_5, styles.marginHorizontal_15]}>

                                    <View style={[styles.overHidden]}>
                                        <TouchableOpacity onPress={() => this.toggleModalDelivery()} style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, (this.state.deliveryId !== null ? styles.border_red : styles.border_gray)]}>
                                            <Text style={[styles.textBold, styles.textSize_13, (this.state.deliveryId !== null ? styles.text_red : styles.text_light_gray)]}>
                                                { this.state.delivery }
                                            </Text>
                                            <Icon style={[styles.textSize_14, styles.text_light_gray]} type="AntDesign" name='down' />
                                        </TouchableOpacity>
                                    </View>

                                    <Modal isVisible={this.state.isModalDelivery} onBackdropPress={() => this.toggleModalDelivery()} style={[ styles.bottomCenter, styles.Width_100 ]}>
                                        <View style={[styles.overHidden, styles.bg_White, styles.Width_100, styles.position_R, styles.top_20]}>

                                            <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                                                {
                                                    this.props.deliveryTypes ?
                                                        this.props.deliveryTypes.map((type, i ) => {
                                                            return(
                                                                <TouchableOpacity
                                                                    key={i}
                                                                    style               = {[styles.rowGroup, styles.marginVertical_10]}
                                                                    onPress             = {() => this.selectDeliveryId(type.id, type.name)}
                                                                >
                                                                    <View style={[styles.overHidden, styles.rowRight]}>
                                                                        <CheckBox
                                                                            style               = {[styles.checkBox, styles.bg_red, styles.border_red]}
                                                                            color               = {styles.text_red}
                                                                            selectedColor       = {styles.text_red}
                                                                            checked             = {this.state.deliveryId === 1}
                                                                            onPress             = {() => this.selectDeliveryId(type.id, type.name)}
                                                                        />
                                                                        <Text style={[styles.textRegular , styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                            {type.name}
                                                                        </Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                        :
                                                        null
                                                }
                                            </View>

                                        </View>
                                    </Modal>

                                    <View style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray]}>
                                        <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                            { i18n.t('priceprod') }
                                        </Text>
                                        <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                            {this.state.totalPrice} { i18n.t('RS') }
                                        </Text>
                                    </View>

                                    <View style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray]}>
                                        <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                            { i18n.t('deliveryprice') }
                                        </Text>
                                        <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                            {this.props.cartInfo.delivery_price} { i18n.t('RS') }
                                        </Text>
                                    </View>

                                    <View style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_black, styles.Border, styles.border_gray]}>
                                        <Text style={[styles.textBold, styles.textSize_13, styles.text_White]}>
                                            { i18n.t('totalprice') }
                                        </Text>
                                        <Text style={[styles.textBold, styles.textSize_13, styles.text_White]}>
                                            {Number(this.state.totalPrice) + Number(this.props.cartInfo.delivery_price)} { i18n.t('RS') }
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,]}
                                        onPress     = {() => this.getLocation()}
                                    >
                                        <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                            { i18n.t('sent') }
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            :
                            null
                    }


                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({ auth, profile, lang , cartInfo , deliveryTypes}) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
        cartInfo: cartInfo.cartInfo,
        deliveryTypes   : deliveryTypes.deliveryTypes,
    };
};
export default connect(mapStateToProps, {getCartInfo , getDeliveryTypes})(DetailsCart);

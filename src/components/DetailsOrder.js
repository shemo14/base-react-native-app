import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, I18nManager,} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Title, CheckBox, Form, Textarea,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getOrderInfo , changeOrderStatus} from "../actions";
import * as Animatable from 'react-native-animatable';
import Modal from "react-native-modal";
import {NavigationEvents} from "react-navigation";
import COLORS from "../consts/colors";

class DetailsOrder extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                     : false,
            isModalComment              : false,
            status                      : this.props.navigation.state.params.status,
            Error                       : '',
            massage                     : '',
            loader: true,
            isSubmitted: false,
        }
    }

    componentWillMount(){
        this.setState({loader: true ,isSubmitted: false});
        const token = this.props.user ? this.props.user.token : null;
        this.props.getOrderInfo(this.props.lang, this.props.navigation.state.params.order_id , token)

    }

    componentWillReceiveProps(nextProps) {
        this.setState({loader: false , isSubmitted: false});

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

    toggleModalComment = () => {
        this.setState({ isModalComment  : !this.state.isModalComment});
    };
    validate = () => {

        let isError     = false;
        let msg         = '';

        if (this.state.massage === '') {
            isError     = true;
            msg         = i18n.t('addcomm');
        }

        if (msg !== '') {
            this.setState({ Error : msg});
        }

        return isError;
    };

    sentComment(){
        const err = this.validate();

        if (!err){
            this.setState({ isModalComment  : !this.state.isModalComment , isSubmitted: true });
            this.props.changeOrderStatus(this.props.lang, this.props.navigation.state.params.order_id ,this.props.user.type === 'user'? 7 : 8 ,this.state.massage , null , this.props.user.token , this.props )
            // this.props.navigation.navigate('MyOrders');
        }

    }

    renderFinishOrder(){
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' }, styles.width_150 ,styles.flexCenter ,  styles.marginVertical_25]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity
                style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_light_gray,styles.marginHorizontal_5]}
                onPress     = {() => this.finishOrder()}
            >
                <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                    { i18n.t('finishOrder') }
                </Text>
            </TouchableOpacity>
        );
    }
    finishOrder(){
        this.setState({isSubmitted: true });
        this.props.changeOrderStatus(this.props.lang, this.props.navigation.state.params.order_id ,7 ,'' , null , this.props.user.token , this.props )
    }


    renderAcceptOrder(){
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' },styles.flexCenter ,  styles.marginVertical_25]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <View style={[styles.Width_100 , styles.rowGroup]}>
                <TouchableOpacity
                    style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,styles.marginHorizontal_5]}
                    onPress     = {() => this.acceptOrder()}
                >
                    <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                        { i18n.t('ok') }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_light_gray,styles.marginHorizontal_5]}
                    onPress={() => this.toggleModalComment()}
                >
                    <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                        { i18n.t('refuse') }
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    acceptOrder(){
        this.setState({ isSubmitted: true });
        this.props.changeOrderStatus(this.props.lang, this.props.navigation.state.params.order_id ,2 ,'' , null , this.props.user.token , this.props )
    }


    renderUnderApprovalOrder(){
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' },styles.flexCenter ,  styles.marginVertical_25]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <View style={[styles.Width_100 , styles.rowCenter]}>
                {
                    this.props.orderInfo.status === 3?
                        <TouchableOpacity
                            style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,styles.marginHorizontal_5]}
                            onPress     = {() => this.orderProcessing()}
                        >
                            <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                { i18n.t('orderProcessing') }
                            </Text>
                        </TouchableOpacity>
                        :
                        this.props.orderInfo.status === 4?
                            <TouchableOpacity
                                style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,styles.marginHorizontal_5]}
                                onPress     = {() => this.orderDelivery()}
                            >
                                <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                    { i18n.t('orderDelivery') }
                                </Text>
                            </TouchableOpacity>
                            :
                            this.props.orderInfo.status === 5?
                                <TouchableOpacity
                                    style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,styles.marginHorizontal_5]}
                                    onPress     = {() => this.finishOrder()}
                                >
                                    <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                        { i18n.t('finishOrder') }
                                    </Text>
                                </TouchableOpacity>
                                :
                                null
                }

                {
                    this.props.orderInfo.status === 2 || this.props.orderInfo.status === 3 || this.props.orderInfo.status === 4 || this.props.orderInfo.status === 5?
                        <TouchableOpacity
                            style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_light_gray,styles.marginHorizontal_5]}
                            onPress={() => this.providerCancelOrder()}
                        >
                            <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                { i18n.t('cancelOrder') }
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                }

            </View>
        );
    }

    providerCancelOrder(){
        this.setState({ isSubmitted: true });
        this.props.changeOrderStatus(this.props.lang, this.props.navigation.state.params.order_id ,7 ,'' , null , this.props.user.token , this.props )
    }
    orderProcessing(){
        this.setState({ isSubmitted: true });
        this.props.changeOrderStatus(this.props.lang, this.props.navigation.state.params.order_id ,4 ,'' , null , this.props.user.token , this.props )
    }
    orderDelivery(){
        this.setState({ isSubmitted: true });
        this.props.changeOrderStatus(this.props.lang, this.props.navigation.state.params.order_id ,5 ,'' , null , this.props.user.token , this.props )
    }

    finishOrder(){
        this.setState({ isSubmitted: true });
        this.props.changeOrderStatus(this.props.lang, this.props.navigation.state.params.order_id ,6 ,'' , null , this.props.user.token , this.props )
    }

    onFocus(){
        this.componentWillMount();
    }
    render() {

        return (
            <Container>

                { this.renderLoader() }
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('orderDet') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_80, styles.right_0, styles.top_0 ]}/>
                    {
                        this.props.orderInfo?
                            <View>
                                <View style={[ styles.rowGroup, styles.paddingHorizontal_10, styles.marginVertical_10, styles.overHidden, styles.Width_100 ]}>

                                    {
                                        this.props.orderInfo.meals?
                                            this.props.orderInfo.meals.map((meal, i) => (
                                                <View key={i}
                                                      style={[ styles.Width_45, styles.marginHorizontal_5, styles.marginVertical_10 ]}>
                                                    <Animatable.View animation="fadeInRight" easing="ease-out" delay={500} style={[ styles.Width_100, styles.position_R ]}>
                                                        <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                                                        <View style = {[styles.position_R, styles.bg_White , styles.Width_100, styles.Border, styles.border_gray, styles.paddingVertical_5]}>
                                                            <View style = {[ styles.Width_100]}>
                                                                <View style = {[styles.height_100, styles.marginHorizontal_5]}>
                                                                    <Image style = {[styles.Width_100 , styles.height_100]} source={{uri:meal.image}}/>
                                                                </View>
                                                            </View>
                                                            <View style = {[ styles.Width_100, styles.marginVertical_5, styles.paddingHorizontal_10 ]}>
                                                                <View style={[ styles.rowGroup ]}>
                                                                    <Text style={[styles.textRegular, styles.text_black, styles.textSize_12]}>{(meal.title).substr(0,20)}</Text>
                                                                </View>
                                                                <View style={[ ]}>
                                                                    <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_10 , {alignSelf:"flex-start"}]}>{meal.additions}</Text>
                                                                    <Text style = {[styles.textRegular, styles.text_red, styles.textSize_12, I18nManager.isRTL ? styles.border_right : styles.border_left, styles.paddingHorizontal_10, styles.marginVertical_5]}>{meal.price} { i18n.t('RS') }</Text>
                                                                </View>
                                                            </View>
                                                            <View style={[ styles.Border, styles.border_red ,styles.flexCenter, styles.position_A, styles.bottom_10, styles.right_5, styles.paddingHorizontal_5, styles.paddingVertical_5 ]}>
                                                                <Text style={[ styles.text_red, styles.textRegular, styles.textSize_14]}>{meal.quantity}</Text>
                                                            </View>
                                                        </View>
                                                    </Animatable.View>
                                                </View>
                                            ))
                                            :
                                            null
                                    }

                                </View>

                                <View style={[ styles.marginVertical_10, styles.paddingHorizontal_5, styles.marginHorizontal_15]}>

                                    <View style={[ styles.position_R,  ]}>
                                        <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                                        <View style={[styles.bg_White, styles.Border, styles.border_gray, styles.paddingHorizontal_10, styles.paddingVertical_10 ]}>

                                            <View style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray]}>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                                    { i18n.t('delver') }
                                                </Text>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                                    {this.props.orderInfo.delivery_type}
                                                </Text>
                                            </View>

                                            <View style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray]}>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                                    { i18n.t('tieat') }
                                                </Text>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                                    {this.props.orderInfo.duration}
                                                </Text>
                                            </View>

                                            <View style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray]}>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                                    { i18n.t('productNum') }
                                                </Text>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                                    {this.props.orderInfo.items_count}
                                                </Text>
                                            </View>

                                            <View style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray]}>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                                    { i18n.t('deliveryprice') }
                                                </Text>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_black]}>
                                                    {this.props.orderInfo.delivery_price} { i18n.t('RS') }
                                                </Text>
                                            </View>

                                            <View style={[ styles.marginVertical_5 , styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.rowGroup, styles.bg_black, styles.Border, styles.border_gray]}>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_White]}>
                                                    { i18n.t('totalprice') }
                                                </Text>
                                                <Text style={[styles.textBold, styles.textSize_13, styles.text_White]}>
                                                    {this.props.orderInfo.total_price} { i18n.t('RS') }
                                                </Text>
                                            </View>

                                        </View>
                                    </View>

                                    <View style={[ styles.position_R,styles.marginVertical_20 ]}>
                                        <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                                        <View style={[styles.bg_White, styles.borderRed, styles.paddingHorizontal_10, styles.paddingVertical_10 ]}>
                                            <Text style={[ styles.textRegular, styles.text_black, styles.textSize_14 ]}>
                                                { i18n.t('orderStatus') }
                                            </Text>
                                            <Text style={[ styles.textRegular, styles.text_red, styles.textSize_14 ]}>
                                                {this.props.orderInfo.status_name}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style= {[ styles.rowCenter ]}>
                                        {
                                            (this.state.status === 2&& this.props.user.type === 'user') ?
                                                <View style={[styles.rowGroup]}>
                                                    <TouchableOpacity
                                                        style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,styles.marginHorizontal_5]}
                                                        onPress     = {() => this.props.navigation.navigate('Payment' ,
                                                            {fromNav:'DetailsOrder' , order_id :this.props.navigation.state.params.order_id
                                                                , delivery_type:this.props.orderInfo.delivery_type})}
                                                    >
                                                        <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                                            { i18n.t('payer') }
                                                        </Text>
                                                    </TouchableOpacity>
                                                    {
                                                        this.renderFinishOrder()
                                                    }
                                                </View>
                                                :
                                                <View/>
                                        }
                                        {
                                            (this.state.status === 1 && this.props.user.type === 'user') ?
                                                <TouchableOpacity
                                                    style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_light_gray,styles.marginHorizontal_5 ,{alignSelf:'center'}]}
                                                    onPress     = {() => this.toggleModalComment()}
                                                >
                                                    <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                                        { i18n.t('cancelOrder') }
                                                    </Text>
                                                </TouchableOpacity>
                                                :
                                                <View/>
                                        }
                                        {
                                            (this.state.status === 1 && this.props.user.type === 'provider') ?
                                                this.renderAcceptOrder()
                                                :
                                                <View/>
                                        }
                                        {
                                            (this.props.user.type === 'provider') ?
                                                this.renderUnderApprovalOrder()
                                                :
                                                <View/>
                                        }
                                    </View>

                                    <Modal isVisible={this.state.isModalComment} onBackdropPress={() => this.toggleModalComment()} style={[ styles.bottomCenter, styles.Width_100 ]}>
                                        <View style={[styles.overHidden, styles.bg_White , styles.Width_100, styles.position_R, styles.top_20]}>

                                            <View style={[styles.paddingVertical_15]}>
                                                <Text style={[styles.textBold, styles.text_black, styles.textSize_16, styles.textLeft , styles.SelfCenter]}>
                                                    {i18n.t('cancelOrder')}
                                                </Text>
                                            </View>

                                            <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                                                <Form style={[styles.Width_100, styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>

                                                    <View style={[styles.rowGroup, styles.Width_100]}>
                                                        <View style={[styles.position_R, styles.flex_1, styles.paddingHorizontal_10, styles.height_100]}>
                                                            <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full ]} />
                                                            <Textarea
                                                                placeholder         = {i18n.t('cancelOrderReason')}
                                                                onChangeText        = {(massage) => this.setState({massage})}
                                                                style               = {[styles.textArea, styles.height_100, styles.paddingVertical_10, styles.bg_White, styles.Border, styles.border_gray]}
                                                                value               = {this.state.massage}
                                                            />
                                                        </View>
                                                    </View>

                                                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_red, styles.textCenter]}>{ this.state.Error }</Text>

                                                    <TouchableOpacity
                                                        style       = {[styles.bg_red, styles.width_150, styles.flexCenter, styles.marginVertical_15, styles.height_40]}
                                                        onPress     = {() => this.sentComment()}>
                                                        <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                                            {i18n.translate('cancelOrder')}
                                                        </Text>
                                                    </TouchableOpacity>

                                                </Form>

                                            </View>

                                        </View>
                                    </Modal>

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


const mapStateToProps = ({ auth, profile, lang , orderInfo}) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
        orderInfo: orderInfo.orderInfo,
    };
};
export default connect(mapStateToProps, {getOrderInfo , changeOrderStatus})(DetailsOrder);

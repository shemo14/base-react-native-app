import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground  , FlatList, Platform, I18nManager} from "react-native";
import { Icon } from 'native-base'
import styles from '../../assets/style'
import {connect} from "react-redux";
import i18n from "../../locale/i18n";
import { deleteCart , editCart } from '../actions'
import * as Animatable from "react-native-animatable";

class CartItem extends Component {
    constructor(props){
        super(props);

        this.state={
            count : this.props.item.quantity,
        }
    }

    incrementCount() {
        this.setState({count: this.state.count + 1});
        // this.props.pushItem(this.props.item.id, this.state.count + 1);
        this.props.editCart(this.props.lang, this.props.providerId, this.props.item.id, this.state.count + 1, this.props.user.token, this.props)
    }

    DecrementCount() {
        if (this.state.count > 1){
            this.setState({count: this.state.count - 1});
            // this.props.pullItem(this.props.item.id, this.state.count - 1);
            this.props.editCart(this.props.lang, this.props.providerId, this.props.item.id, this.state.count - 1, this.props.user.token, this.props)
        }
    }

    deleteCart(id) {
        this.props.deleteCart(this.props.lang, this.props.providerId, id, this.props.user.token, this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ count: nextProps.item.quantity });
    }

    render() {

        return (
            <View style={[ styles.flex_45, styles.marginHorizontal_5, styles.marginVertical_10 ]}>
                <Animatable.View animation="fadeInRight" easing="ease-out" delay={500} style={[ styles.Width_100, styles.position_R ]}>
                    <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                    <View style = {[styles.position_R, styles.bg_White , styles.Width_100, styles.Border, styles.border_gray, styles.paddingVertical_5]}>
                        <View style = {[ styles.Width_100, styles.rowGroup ]}>
                            <View style = {[styles.flex_1 , styles.height_100, styles.marginHorizontal_5]}>
                                <Image style = {[styles.Width_100 , styles.height_100]} source={{uri: this.props.item.image}}/>
                            </View>
                            <View style = {[ styles.marginHorizontal_5]}>
                                <TouchableOpacity onPress={() => this.incrementCount()} style={[ styles.bg_light_red, styles.paddingHorizontal_5, styles.paddingVertical_5, styles.flexCenter, styles.marginVertical_5 ]}>
                                    <Icon type={'Entypo'} name={'plus'} style={[ styles.text_red, styles.textSize_14 ]}/>
                                </TouchableOpacity>
                                <View style={[styles.Border, styles.border_red, styles.paddingHorizontal_5, styles.paddingVertical_5]}>
                                    <Text style={[styles.text_red, styles.textRegular, styles.textSize_14, styles.textCenter]}>{this.state.count}</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.DecrementCount()} style={[ styles.bg_light_gray, styles.paddingHorizontal_5, styles.paddingVertical_5, styles.flexCenter, styles.marginVertical_5 ]}>
                                    <Icon type={'Entypo'} name={'minus'} style={[ styles.text_White, styles.textSize_14 ]}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style = {[ styles.Width_100, styles.marginVertical_5, styles.paddingHorizontal_10 ]}>
                            <View style={[ styles.rowGroup ]}>
                                <Text style={[styles.textRegular, styles.text_black, styles.textSize_12]}>{this.props.item.title}</Text>
                            </View>
                            <View style={[ ]}>
                                <Text style={[styles.textRegular, styles.text_light_gray, styles.textSize_12 , {alignSelf:'flex-start'}]}>{this.props.item.additions}</Text>
                                <Text style = {[styles.textRegular, styles.text_red, styles.textSize_12,I18nManager.isRTL ? styles.border_right : styles.border_left, styles.paddingHorizontal_10]}>{this.props.item.price} { i18n.t('RS') }</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => this.deleteCart(this.props.item.id)}
                            style={[ styles.bg_red, styles.width_40, styles.height_40, styles.flexCenter, styles.position_A, styles.bottom_10, styles.right_0 ]}>
                            <Icon type={'AntDesign'} name={'close'} style={[ styles.text_White, styles.textSize_22 ]}/>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        );
    }
}

const mapStateToProps = ({ lang, profile }) => {
    return {
        lang        : lang.lang,
        user		: profile.user,
    };
};
export default connect(mapStateToProps, {deleteCart , editCart})(CartItem);

import React, { Component } from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import { Right, Left, ListItem, CheckBox } from 'native-base';
import * as Animatable from "react-native-animatable";
import styles from "../../assets/style";
import i18n from "../../locale/i18n";


class BillCheckItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            checked: false
        }
    }

    setCheck(){
        this.setState({ checked: !this.state.checked });
        this.props.addItem(this.props.data.id, !this.state.checked)
    }

    render(){
        return(
            <Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[ styles.Width_100, styles.marginVertical_10 ]}>
                <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                <TouchableOpacity onPress={() => this.setCheck()}>
                    <View style={[ styles.rowGroup, styles.bg_White, styles.Border, styles.border_gray, styles.paddingHorizontal_10, styles.paddingVertical_10, styles.position_R ]}>
                        <View style={[ styles.flex_100 ]}>
                            <View style={[ styles.rowRight]}>
                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_120]}>
                                    { i18n.t('numorders') }
                                </Text>
                                <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                    {this.props.data.id}
                                </Text>
                            </View>
                            <View style={[ styles.rowRight]}>
                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_120]}>
                                    { i18n.t('orderType') }
                                </Text>
                                <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                    {this.props.data.type}
                                </Text>
                            </View>
                            <View style={[ styles.rowRight]}>
                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.width_120]}>
                                    { i18n.t('bepaid') }
                                </Text>
                                <Text style={[styles.text_black_gray, styles.textSize_13]}>:</Text>
                                <Text style={[styles.textRegular, styles.text_black_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                    {this.props.data.price} { i18n.t('RS') }
                                </Text>
                            </View>
                        </View>
                        <CheckBox
                            style               = {[styles.checkBox, styles.bg_red, styles.border_red, styles.position_A , styles.top_10, { left : '95%' }]}
                            color               = {styles.text_red}
                            selectedColor       = {styles.text_red}
                            checked             ={this.state.checked}
                            onPress             ={() => this.setCheck()}
                        />
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        )
    }
}


export default BillCheckItem;
import React, { Component } from "react";
import {Image, Text} from "react-native";
import i18n from '../../locale/i18n'
import styles from "../../assets/style";

class ShareApp extends Component {
    constructor(props){
        super(props);

        this.state={

        }
    }

    static navigationOptions = () => ({
        header          : null,
        drawerLabel     : (<Text style={[styles.textRegular, styles.textSize_16]}>{i18n.translate('shareApp')}</Text>) ,
        drawerIcon      : (<Image style={[styles.headImage]} source={require('../../assets/img/connections.png')} resizeMode={'contain'}/>)
    });

    render() {
        return false
    }
}

export default ShareApp;

import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {Body, Button, Container, Content, Header, Icon, Left, Title,} from 'native-base';
import styles from '../../assets/style';

import i18n from "../../locale/i18n";
import * as Animatable from 'react-native-animatable';

import {connect} from "react-redux";
import { chooseLang } from '../actions';

class Language extends Component {
    constructor(props){
        super(props);
        this.state          = {};
        this.onChooseLang   = this.onChooseLang.bind(this);
        this.state = {
            spinner                     : false,
            lang                        : '',
            active                      : 0,
        }
    }

    onChooseLang(lang, id) {
        this.setState({ active : id });
        this.state.lang = lang;
    };

    componentWillMount() {

        const lang  = this.props.lang;

        this.setState({ lang : this.props.lang });

        if(lang === 'ar'){
            this.setState({ active : 1 });
        }else if (lang === 'en'){
            this.setState({ active : 2 });
        }

        this.setState({spinner: true});

    }

    onClick(){
        this.props.chooseLang(this.state.lang);
        this.props.navigation.navigate('Setting');
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
                            { i18n.t('language') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10]}>
                        <View style={[ styles.position_R, styles.marginHorizontal_20, styles.bgFullWidth ]}>
                            <View style={[ styles.bg_White, styles.paddingHorizontal_10, styles.paddingVertical_10, styles.Border, styles.border_gray, styles.bgFullWidth ]}>

                                <View style={[ styles.marginVertical_10 ]}>

                                    <View style={[styles.overHidden]}>
                                        <Animatable.View animation="fadeIn" easing="ease-out" delay={500} style={[ styles.marginVertical_5 ]}>
                                            <TouchableOpacity
                                                style       = {[ styles.rowGroup, styles.Border, styles.paddingVertical_10, styles.paddingHorizontal_10, ( this.state.active === 1 ? styles.border_red : styles.border_gray) ]}
                                                onPress     = {() => this.onChooseLang('ar', 1)}
                                            >
                                                <Text style={[ styles.textRegular, styles.textSize_14,  ( this.state.active === 1 ? styles.text_red : styles.text_light_gray) ]}>العربيه</Text>
                                                <Icon style={[styles.textSize_20, ( this.state.active === 1 ? styles.text_red : styles.text_light_gray)]} type="Feather" name={( this.state.active === 1 ? 'check-circle' : '')} />
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    </View>

                                    <View style={[styles.overHidden]}>
                                        <Animatable.View animation="fadeIn" easing="ease-out" delay={500} style={[ styles.marginVertical_5 ]}>
                                            <TouchableOpacity
                                                style       = {[ styles.rowGroup, styles.Border, styles.paddingVertical_10, styles.paddingHorizontal_10, ( this.state.active === 2 ? styles.border_red : styles.border_gray) ]}
                                                onPress     = {() => this.onChooseLang( 'en', 2)}
                                            >
                                                <Text style={[ styles.textRegular, styles.textSize_14,  ( this.state.active === 2 ? styles.text_red : styles.text_light_gray) ]}>English</Text>
                                                <Icon style={[styles.textSize_20, ( this.state.active === 2 ? styles.text_red : styles.text_light_gray)]} type="Feather" name={( this.state.active === 2 ? 'check-circle' : '')} />
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    </View>

                                </View>

                                <TouchableOpacity
                                    style       = {[ styles.bg_red ,styles.marginVertical_30 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter,styles.marginHorizontal_5]}
                                    onPress     = {() => this.onClick()}
                                >
                                    <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                        { i18n.t('choose') }
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>

                </Content>

            </Container>

        );
    }
}

// export default Language;

const mapStateToProps = ({ lang }) => {
    return {
        lang    : lang.lang
    };
};

export default connect(mapStateToProps, { chooseLang })(Language);

import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, I18nManager} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Title, Form, Textarea, Icon,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {chooseLang} from "../actions";
import * as Animatable from 'react-native-animatable';
import Modal from "react-native-modal";

class Setting extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                     : false,
            switchValue                 : false
        }
    }

    componentWillMount() {

        this.setState({spinner: true});

    }

    toggleSwitch = (value) => {
        this.setState({switchValue: value})
    }

    static navigationOptions = () => ({
        header          : null,
        drawerLabel     : (<Text style={[styles.textRegular, styles.textSize_16]}>{i18n.translate('setting')}</Text>) ,
        drawerIcon      : (<Image style={[styles.headImage]} source={require('../../assets/img/settings.png')} resizeMode={'contain'}/>)
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
                            { i18n.t('setting') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10]}>
                        <View style={[ styles.position_R, styles.marginHorizontal_20, styles.bgFullWidth ]}>
                            <View style={[ styles.bg_White, styles.paddingHorizontal_10, styles.paddingVertical_10, styles.Border, styles.border_gray, styles.bgFullWidth ]}>
                                <View style={[styles.marginVertical_20]}>

                                    <View style={[styles.overHidden]}>
                                        <Animatable.View animation="fadeIn" easing="ease-out" delay={500} style={[ styles.marginVertical_5 ]}>
                                            <TouchableOpacity
                                                style       = {[ styles.rowGroup, styles.Border, styles.border_gray, styles.paddingVertical_10, styles.paddingHorizontal_10 ]}
                                                onPress     = {() => this.props.navigation.navigate('EditProfile')}
                                            >
                                                <Text style={[ styles.textRegular, styles.text_light_gray, styles.textSize_14 ]}>{ i18n.t('editdata') }</Text>
                                                <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name={I18nManager.isRTL ?'left' : 'right'} />
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    </View>
                                    <View style={[styles.overHidden]}>
                                        <Animatable.View animation="fadeIn" easing="ease-out" delay={600} style={[ styles.marginVertical_5]}>
                                            <TouchableOpacity
                                                style       = {[ styles.rowGroup, styles.Border, styles.border_gray, styles.paddingVertical_10, styles.paddingHorizontal_10 ]}
                                                onPress     = {() => this.props.navigation.navigate('Language')}
                                            >
                                                <Text style={[ styles.textRegular, styles.text_light_gray, styles.textSize_14 ]}>{ i18n.t('lang') }</Text>
                                                <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name={I18nManager.isRTL ?'left' : 'right'} />
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    </View>

                                    {/*<View style={[styles.overHidden]}>*/}
                                    {/*    <Animatable.View animation="fadeIn" easing="ease-out" delay={600} style={[ styles.marginVertical_5]}>*/}
                                    {/*        <TouchableOpacity*/}
                                    {/*            style       = {[ styles.rowGroup, styles.Border, styles.border_gray, styles.paddingVertical_10, styles.paddingHorizontal_10 ]}>*/}
                                    {/*            <Text style={[ styles.textRegular, styles.text_light_gray, styles.textSize_14 ]}>{ i18n.t('Available') }</Text>*/}
                                    {/*            <Switch*/}
                                    {/*                style           = {[ styles.switch ]}*/}
                                    {/*                onValueChange   = {this.toggleSwitch}*/}
                                    {/*                value           = {this.state.switchValue}*/}
                                    {/*                onTintColor     = {'#F00'}*/}
                                    {/*                thumbTintColor  = {'#fff'}*/}
                                    {/*                tintColor       = {'#DDD'}*/}
                                    {/*            />*/}
                                    {/*        </TouchableOpacity>*/}
                                    {/*    </Animatable.View>*/}
                                    {/*</View>*/}

                                </View>
                            </View>
                        </View>
                    </View>



                </Content>

            </Container>

        );
    }
}

export default Setting;

// const mapStateToProps = ({ auth, profile, lang }) => {
//     return {
//         auth: auth.user,
//         user: profile.user,
//         lang: lang.lang
//     };
// };
// export default connect(mapStateToProps, {})(Home);

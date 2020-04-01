import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Title,
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {chooseLang} from "../actions";
import * as Animatable from 'react-native-animatable';

class ConfirmPayment extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinner                 : false,
        }
    }

    componentWillMount() {

        this.setState({spinner: true});

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
                            { i18n.t('confirmpayment') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10, { top : -30 }]}>
                        <View style={[ styles.paddingHorizontal_10, styles.paddingVertical_10, styles.Border, styles.border_gray, styles.bgFullWidth ]}>
                            <View style={[ styles.overHidden, styles.marginVertical_20, styles.rowLeft, styles.marginHorizontal_20 ]}>
                                <Animatable.View animation="bounceIn" easing="ease-out" delay={500} style={[styles.flexCenter]}>
                                    <Image style={[styles.minImage]} source={require('../../assets/img/smile.png')}/>
                                </Animatable.View>
                            </View>
                            <View style={[styles.overHidden]}>
                                <Animatable.View animation="fadeInRight" easing="ease-out" delay={500}>
                                    <Text style={[styles.textRegular , styles.text_black, styles.textCenter, styles.Width_100, styles.marginVertical_15]}>
                                        { i18n.t('confirmationText') }
                                    </Text>
                                </Animatable.View>
                            </View>
                            <TouchableOpacity
                                style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,]}
                                onPress     = {() => this.props.navigation.navigate('Home')}
                            >
                                <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                                    { i18n.t('gohome') }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </Content>

            </Container>

        );
    }
}

export default ConfirmPayment;

// const mapStateToProps = ({ auth, profile, lang }) => {
//     return {
//         auth: auth.user,
//         user: profile.user,
//         lang: lang.lang
//     };
// };
// export default connect(mapStateToProps, {})(Home);

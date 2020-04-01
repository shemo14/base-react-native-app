import React, { Component } from "react";
import {View, Text, Image, ActivityIndicator} from "react-native";
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
import {getContactInfo} from "../actions";
import * as Animatable from 'react-native-animatable';
import COLORS from "../consts/colors";

class Terms extends Component {
    constructor(props){
        super(props);
        this.state = {
            loader: true
        }
    }
    static navigationOptions = () => ({
        header          : null,
        drawerLabel     : (<Text style={[styles.textRegular, styles.textSize_16]}>{i18n.translate('terms')}</Text>) ,
        drawerIcon      : (<Image style={[styles.headImage]} source={require('../../assets/img/locked.png')} resizeMode={'contain'}/>)
    });

    componentWillMount() {
        this.setState({loader: true});
        this.props.getContactInfo(this.props.lang)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({loader: false});
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

    render() {

        return (
            <Container>
                { this.renderLoader() }
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('terms') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.bgFullWidth , styles.paddingVertical_10]}>
                        <View style={[ styles.position_R, styles.marginHorizontal_20, styles.bgFullWidth ]}>
                            <View style={[ styles.position_A, styles.shapeBlock, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white ]} />
                            <View style={[ styles.bg_White, styles.paddingHorizontal_10, styles.paddingVertical_10, styles.Border, styles.border_gray, styles.bgFullWidth ]}>
                                <View style={[ styles.overHidden, styles.marginVertical_20 ]}>
                                    <Animatable.View animation="bounceIn" easing="ease-out" delay={500} style={[styles.flexCenter]}>
                                        <Image style={[styles.icoImage]} source={require('../../assets/img/icon.png')}/>
                                    </Animatable.View>
                                </View>
                                <View style={[styles.overHidden]}>
                                    <Animatable.View animation="fadeInRight" easing="ease-out" delay={500}>
                                        {
											this.props.contactInfo && this.props.contactInfo.terms ?
												<Text style={[{alignSelf: 'flex-start'} ,styles.textRegular , styles.text_black, styles.rowRight, styles.Width_100, styles.marginVertical_15]}>
													{this.props.contactInfo.terms}
												</Text>
                                                :
                                                null
                                        }
                                    </Animatable.View>
                                </View>
                            </View>
                        </View>
                    </View>


                </Content>

            </Container>

        );
    }
}

const mapStateToProps = ({ contactInfo, lang }) => {
    return {
        lang        : lang.lang,
        contactInfo : contactInfo.contactInfo,
        loader      : contactInfo.loader
    };
};
export default connect(mapStateToProps, {getContactInfo})(Terms);

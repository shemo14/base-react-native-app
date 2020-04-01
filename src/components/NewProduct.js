import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView,} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Title, Right, Icon, Form, Item, Input, CheckBox, Toast
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {getCategories , addCategory} from "../actions";
import Modal from "react-native-modal";
import { NavigationEvents } from "react-navigation";
import CategoryPicker from "./CategoryPicker"
import COLORS from "../consts/colors";

class NewProduct extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectFilter                  : false,
            filter                        : i18n.t('mainCategory'),
            filterId                      : null,
            category_id                   : null,
            nameAr                        : '',
            nameEn                        : '',
            nameArStatus                  : 0,
            nameEnStatus                  : 0,
            isSubmitted                   : false,

        }
    }

    activeInput(type) {

        if (type === 'nameAr' || this.state.nameAr !== '') {
            this.setState({nameArStatus: 1})
        }

        if (type === 'nameEn' || this.state.nameEn !== '') {
            this.setState({nameEnStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'nameAr' || this.state.nameAr !== '') {
            this.setState({nameArStatus: 0})
        }

        if (type === 'nameEn' || this.state.nameEn !== '') {
            this.setState({nameEnStatus: 0})
        }

    }


    onConfirm() {
        this.setState({ isSubmitted: true });
        this.props.addCategory( this.props.lang , this.state.nameAr , this.state.nameEn , this.state.category_id, this.props.user.token , this.props );

    }

    componentWillMount() {
        this.setState({ isSubmitted: false });
        this.props.getCategories(this.props.lang ,null);
    }
    selectedId = (id) => {
        // alert(id)
        this.setState({category_id:id})
    }
    renderConfirm(){
        if (this.state.category_id === null || this.state.name_ar == '' || this.state.name_en == ''){
            return (
                <View
                    style={[styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red , {backgroundColor:"#999"}]}>
                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                        {i18n.translate('confirm')}
                    </Text>
                </View>
            );
        }
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginVertical_15]}>
                    <ActivityIndicator size="large" color={COLORS.red} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity
                style       = {[ styles.marginVertical_25 , styles.width_150, styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.flexCenter, styles.bg_red,]}
                onPress     = {() => this.onConfirm()}
            >
                <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                    { i18n.t('confirm') }
                </Text>
            </TouchableOpacity>
        );
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isSubmitted: false});

    }
    onFocus(){
        this.componentWillMount();
    }

    render() {

        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Image style={[styles.headImage]} source={require('../../assets/img/left.png')} resizeMode={'contain'}/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_red, styles.textSize_16, styles.textLeft, styles.Width_100, styles.paddingHorizontal_5, styles.paddingVertical_0]}>
                            { i18n.t('addCategory') }
                        </Title>
                    </Body>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.Width_100 , styles.paddingVertical_10]}>

                        <View style={[ styles.marginVertical_10, styles.Width_90, styles.flexCenter, styles.bg_White, styles.paddingHorizontal_10 ]}>
                            <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_100]}>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('nameAr')}
                                            style={[styles.input, styles.height_50, (this.state.nameArStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(nameAr) => this.setState({nameAr})}
                                            onBlur={() => this.unActiveInput('nameAr')}
                                            onFocus= {() => this.activeInput('nameAr')}
                                            value= {this.state.nameAr}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('nameEn')}
                                            style={[styles.input, styles.height_50, (this.state.nameEnStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(nameEn) => this.setState({nameEn})}
                                            onBlur={() => this.unActiveInput('nameEn')}
                                            onFocus= {() => this.activeInput('nameEn')}
                                            value= {this.state.nameEn}
                                        />
                                    </Item>
                                </View>


                                <CategoryPicker categories={this.props.categories} selectedId={this.selectedId}/>
                                {
                                    this.renderConfirm()
                                }


                            </Form>
                            </KeyboardAvoidingView>
                        </View>
                    </View>

                </Content>

            </Container>

        );
    }
}


const mapStateToProps = ({ auth, profile, lang, categories}) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
        categories: categories.categories,
    };
};
export default connect(mapStateToProps, {getCategories , addCategory})(NewProduct);

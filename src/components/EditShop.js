import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Title, Right, Icon, Form, Item, Input, CheckBox, Toast,Textarea
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import {connect} from "react-redux";
import {updateProfile} from "../actions";
import Modal from "react-native-modal";
import {NavigationEvents} from "react-navigation";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import COLORS from "../consts/colors";

class EditShop extends Component {
    constructor(props){
        super(props);
        this.state = {
            name                        : this.props.user.provider_name,
            info                        : this.props.user.provider_details,
            nameStatus                  : 1,
            infoStatus                  : 1,
            base64                      : '',
            cityName                    : this.props.user.address,
            userImage                   : this.props.user.cover,
            latitude                    : this.props.user.latitude,
            longitude                   : this.props.user.longitude,
            isSubmitted: false,
        }
    }

    activeInput(type) {

        if (type === 'name' || this.state.name !== '') {
            this.setState({nameStatus: 1})
        }

        if (type === 'info' || this.state.info !== '') {
            this.setState({infoStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'name' && this.state.name === '') {
            this.setState({nameStatus: 0})
        }

        if (type === 'info' && this.state.info === '') {
            this.setState({infoStatus: 0})
        }

    }


    onEditPressed() {
        this.setState({ isSubmitted: true });
        const data = {
            name                : this.state.name,
            email               : null,
            phone               : null,
            country_id          : null,
            gender              : null,
            latitude            : this.state.latitude,
            longitude           : this.state.longitude,
            avatar              : null,
            cover               : this.state.base64,
            provider_details    : this.state.info,
            available           : null,
            delivery_types      : null,
            qualification       : null,
            address             : this.state.cityName,
            lang                : this.props.lang,
            token               : this.props.user.token,
            props               : this.props,
        };


        this.props.updateProfile(data);
    }
    renderEdit(){
        if (this.state.name == '' || this.state.info == ''){
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
                onPress     = {() => this.onEditPressed()}
            >
                <Text style={[styles.textRegular, styles.textSize_13, styles.text_White]}>
                    { i18n.t('confirm') }
                </Text>
            </TouchableOpacity>
        );
    }

    getLocation(){

        this.props.navigation.navigate('MapLocation', {
            pageName : this.props.navigation.state.routeName
        });

    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    _pickImage = async () => {

        this.askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64:true
        });

        if (!result.cancelled) {
            this.setState({ userImage: result.uri ,base64:result.base64});
        }
    };

    componentWillReceiveProps(nextProps) {

        if( nextProps.navigation.state.params !== undefined ||  nextProps.navigation.state.params  !== undefined){
            this.state.cityName             = nextProps.navigation.state.params.city_name;
            this.setState({latitude   : nextProps.navigation.state.params.latitude});
            this.setState({longitude  : nextProps.navigation.state.params.longitude});
        }else{
            this.setState({cityName  : i18n.translate('mapname')});
        }

        this.setState({ isSubmitted   : false});

    }

    componentWillMount() {

        this.setState({ isSubmitted: false });

    }

    onFocus(){
        this.componentWillMount();
    }

    render() {

        let image = this.state.userImage;

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
                            { i18n.t('editstore') }
                        </Title>
                    </Body>
                    <Right style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon type={'AntDesign'} name={'close'} style={[ styles.text_red, styles.textSize_26 ]}/>
                        </Button>
                    </Right>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.Width_100 , styles.paddingVertical_10]}>

                        <View style={[ styles.position_R, styles.Width_70]}>
                            <View style={[ styles.position_A, styles.top_10, styles.left_0, styles.overlay_black, styles.height_full, styles.zIndexDown, { width : '103%' } ]} />
                            <View style={[ styles.position_R, styles.overHidden,styles.Width_100, styles.height_200, styles.flexCenter, styles.overlay_black ]}>
                                <TouchableOpacity
                                    style={[styles.width_40, styles.height_40, styles.overlay_white, styles.flexCenter, styles.position_A, styles.left_0, styles.top_20, styles.zIndex]}
                                    onPress={this._pickImage}
                                >
                                    <Icon style={[styles.text_White, styles.textSize_20]} type="AntDesign" name='plus' />
                                </TouchableOpacity>
                                <View style={[ styles.overHidden,styles.Width_100, styles.height_200, styles.flexCenter, styles.position_R]}>
                                    <Image style={[styles.Width_100, styles.height_200]} source={{ uri: image }} resizeMode={'cover'}/>
                                </View>
                            </View>
                        </View>
                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                        <View style={[ styles.marginVertical_10, styles.Width_85, styles.flexCenter ]}>

                            <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_100]}>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('userName')}
                                            style={[styles.input, styles.height_50, (this.state.nameStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(name) => this.setState({name})}
                                            onBlur={() => this.unActiveInput('name')}
                                            onFocus= {() => this.activeInput('name')}
                                            value= {this.state.name}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.overHidden, styles.rowGroup]}>
                                    <TouchableOpacity
                                        style       = {[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, (this.state.latitude !== null ||  this.state.longitude !== null ? styles.border_red : styles.border_gray)]}
                                        onPress     = {() => this.getLocation()}
                                    >
                                        <Text style={[styles.textRegular, styles.textSize_14, styles.width_150, (this.state.latitude !== null ||  this.state.longitude !== null ? styles.text_red : styles.text_black)]} numberOfLines = { 1 } prop with ellipsizeMode = "tail">
                                            {this.state.cityName}
                                        </Text>
                                        <Icon style={[styles.textSize_20, styles.text_light_gray]} type="Feather" name='map-pin' />
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.position_R, styles.height_100, styles.marginVertical_10, styles.Width_100]}>
                                    <Textarea
                                        placeholder         = {i18n.t('massmtger')}
                                        style               = {[styles.textArea, styles.height_100, styles.paddingVertical_10, styles.bg_White, styles.Border, styles.Width_100,  (this.state.infoStatus === 1 ? styles.border_red : styles.border_light_gray)]}
                                        onChangeText        = {(info) => this.setState({info})}
                                        onBlur              = {() => this.unActiveInput('info')}
                                        onFocus             = {() => this.activeInput('info')}
                                        value               = {this.state.info}
                                    />
                                </View>

                                {this.renderEdit()}

                            </Form>
                        </View>
                        </KeyboardAvoidingView>
                    </View>

                </Content>

            </Container>

        );
    }
}


const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};
export default connect(mapStateToProps, {updateProfile})(EditShop);

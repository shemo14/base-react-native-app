import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView
} from "react-native";
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
import { getCategories , addMeal} from "../actions";
import * as ImageManipulator from 'expo-image-manipulator';
import { NavigationEvents } from "react-navigation";
import {ImageBrowser,CameraBrowser} from 'expo-multiple-imagepicker';
import * as Permissions from 'expo-permissions';
import * as Animatable from "react-native-animatable";
import CategoryPicker from "./CategoryPicker"
import COLORS from "../consts/colors";

let base64   = [];

class AddProduct extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectFilter                : false,
            filter                      : i18n.t('filtermon'),
            filterId                    : null,
            selectKind                  : false,
            selectSubKind               : false,
            subKind                     : i18n.t('filtersub'),
            subKindId                   : null,
            selectTimeOut               : false,
            timeOut                     : '',
            price                       : '',
            priceStatus                 : 0,
            discount                    : '',
            discountStatus              : 0,
            timeOutStatus               : 0,
            active                      : 1,
            imageBrowserOpen            : false,
            cameraBrowserOpen           : false,
            photos                      : [],
            arrayInputs                 : [],
            mainCat                     : null,
            Additions                   : [],
            imageId                     : null,
            refreshed                   : false,
            category_id                 : null,
            isSubmitted                 : false,

        }
    }

    activeInput(type) {

        if (type === 'price' || this.state.price !== '') {
            this.setState({priceStatus: 1})
        }

        if (type === 'discount' || this.state.discount !== '') {
            this.setState({discountStatus: 1})
        }

        if (type === 'timeOut' || this.state.timeOut !== '') {
            this.setState({timeOutStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'price' && this.state.price === '') {
            this.setState({priceStatus: 0})
        }

        if (type === 'discount' && this.state.discount === '') {
            this.setState({discountStatus: 0})
        }

        if (type === 'timeOut' || this.state.timeOut !== '') {
            this.setState({timeOutStatus: 0})
        }

    }

    onConfirm() {
        this.setState({ isSubmitted: true });
       alert(base64.length);
        this.props.addMeal( this.props.lang , this.state.price , this.state.timeOut , this.state.category_id, base64 , this.state.discount, this.state.Additions ,this.props.user.token , this.props );
    }

    onSubCategories ( id ){
        this.setState({spinner: true, active : id });
    }

    selectFilter(id, name , cat) {
        this.setState({
            filterId        : id,
            filter          : name,
            mainCat          : cat,
        });
        this.setState({ selectFilter: !this.state.selectFilter});
    }

    selectedId = (id) => {
         alert(id)
        this.setState({category_id:id})
    }

    componentWillMount() {
        base64 = [];
        this.setState({ isSubmitted: false });
        this.props.getCategories(this.props.lang ,null);

    }
    renderConfirm(){
        if (this.state.category_id === null || this.state.price == ''){
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

    createUI(){
        return this.state.Additions.map((el, i) =>
            <View key={i} style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                    <Input
                        placeholder={i18n.translate('addpro')}
                        value={el||''}
                        style={[styles.input, styles.height_50,  styles.Active ]}
                        onChangeText={this.handleChange.bind(this, i , el)}
                    />
                </Item>
                <TouchableOpacity
                    onPress     = {this.removeClick.bind(this, i)}
                    style       = {[styles.position_A , styles.top_5 , {right:0 , zIndex:10 , borderRadius:50 , width: 20 , height: 20
                        , alignItems:'center' , justifyContent:'center' , backgroundColor:"#d3292a"}]}>
                    <Icon type  = {'EvilIcons'} name={'close'} style={[styles.text_White, styles.textSize_18]} />
                </TouchableOpacity>
            </View>
        )
    }

    handleChange(i, event , el) {
        let Additions = [...this.state.Additions];
        Additions[i] =el;
        this.setState({ Additions });
    }

    addClick(){
        this.setState(prevState => ({ Additions: [...prevState.Additions, '']}))
    }

    removeClick(i){
        let Additions = [...this.state.Additions];
        Additions.splice(i,1);
        this.setState({ Additions });
    }


    async componentDidMount() {
        base64 = [];
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    }

    imgItems = (item, imageId) => {
        return(
            <View style={[ styles.width_70, styles.height_70, styles.marginHorizontal_5, styles.marginVertical_5]}>
                <View style={[ styles.position_A, styles.Border, styles.border_gray, styles.Width_100, styles.height_full, styles.overlay_white, { left : -5, top : -5 } ]} />
                <View style={[ styles.bg_White, styles.paddingHorizontal_5, styles.paddingVertical_5, styles.Border, styles.border_gray,styles.width_70, styles.height_70, styles.overHidden, styles.position_R]}>
                    <Image style={[styles.Width_100, styles.height_full]} source={{uri: item.file}} resizeMode={'cover'}/>
                    <TouchableOpacity
                        onPress     = {() => this.deleteImage(item)}
                        style       = {[styles.position_A , styles.overlay_black, styles.Width_100, styles.height_full, styles.flexCenter, styles.top_5]}>
                        <Icon type  = {'EvilIcons'} name={'close'} style={[styles.text_red, styles.textSize_20]} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    deleteImage(item){
        let index = this.state.photos.indexOf(item);
        let photos = this.state.photos;
        photos.splice(index, 1);
        base64.splice(index, 1);
        this.setState({ photos, refreshed: !this.state.refreshed, imageId: null })
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
            let images = this.state.photos;
            this.setState({
                imageBrowserOpen: false,
                photos: images.concat(photos)
            });

            const imgs = this.state.photos;
            console.log(imgs);
            for (var i =0; i < imgs.length; i++){
                const imageURL = imgs[i].file;
                Image.getSize(imageURL, (width, height) => {
                    var imageSize = [{
                        resize: {
                            width,
                            height
                        }
                    }];

                    console.log('imgURI', imageURL);
                    ImageManipulator.manipulateAsync(imageURL, imageSize, { format: 'png', base64: true }).then(res => {
                        base64.push(res.base64);
                        console.log('res____', res)
                    });
                }, (reason) => console.log(reason))
            }
        }).catch((e) => console.log(e))
    };

    onFocus(){
        base64 = [];
        this.componentWillMount();
    }

    render() {

        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser base64={true} max={5} callback={this.imageBrowserCallback}/>);
        }else if (this.state.cameraBrowserOpen) {
            return(<CameraBrowser base64={true} max={5} callback={this.imageBrowserCallback}/>);
        }


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
                            { i18n.t('addpro') }
                        </Title>
                    </Body>
                    <Right>
                        <Button style={styles.Button} transparent onPress= {() => this.props.navigation.navigate('TermsAddProduct')}>
                            <Text style={[ styles.textRegular , styles.text_black, styles.textSize_14, styles.textDecoration ]}>
                                { i18n.t('termlern') }
                            </Text>
                        </Button>
                    </Right>
                </Header>

                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                    <View style={[ styles.position_A, styles.bg_gray, styles.Width_100, styles.height_70, styles.right_0, styles.top_0, styles.zIndexDown ]}/>

                    <View style={[ styles.position_R, styles.zIndex, styles.Width_100 , styles.paddingVertical_10]}>

                        <View style={[ styles.position_R, styles.Width_100, styles.scroll]}>

                            <View style={[ styles.position_R, styles.Width_45, styles.height_150]}>
                                <View style={[ styles.position_A, styles.top_10, styles.left_0, styles.overlay_white, styles.height_full, styles.zIndexDown, styles.Border, styles.border_gray, { width : '106%' } ]} />
                                <View style={[ styles.position_R, styles.overHidden,styles.Width_100, styles.height_150, styles.flexCenter, styles.bg_White, styles.Border, styles.border_gray ]}>
                                    <TouchableOpacity
                                        style       = {[styles.width_40, styles.height_40, styles.bg_light_red, styles.flexCenter, styles.position_A, styles.right_10, styles.top_10, styles.zIndex]}
                                        onPress     = {() => this.setState({imageBrowserOpen: true})}>
                                        <Icon style = {[styles.text_red, styles.textSize_20]} type="AntDesign" name='plus' />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[ styles.position_R, styles.Width_50, styles.rowCenter, styles.marginHorizontal_20 ]}>
                                <FlatList
                                    data            = {this.state.photos}
                                    renderItem      = {({item}) => this.imgItems(item, this.state.imageId)}
                                    numColumns      = {2}
                                    keyExtractor    = {this._keyExtractor}
                                    extraData       = {this.state.refreshed}
                                />
                            </View>
                        </View>

                        <View style={[ styles.marginVertical_10, styles.Width_85, styles.flexCenter ]}>
                            <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                                <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_100]}>

                                <CategoryPicker categories={this.props.categories} selectedId={this.selectedId}/>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('monyproducer')}
                                            style={[styles.input, styles.height_50, (this.state.priceStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(price) => this.setState({price})}
                                            onBlur={() => this.unActiveInput('price')}
                                            onFocus= {() => this.activeInput('price')}
                                            value= {this.state.price}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('sallproducer')}
                                            style={[styles.input, styles.height_50, (this.state.discountStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(discount) => this.setState({discount})}
                                            onBlur={() => this.unActiveInput('discount')}
                                            onFocus= {() => this.activeInput('discount')}
                                            value= {this.state.discount}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('timeeat')}
                                            style={[styles.input, styles.height_50, (this.state.timeOutStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(timeOut) => this.setState({timeOut})}
                                            onBlur={() => this.unActiveInput('timeOut')}
                                            onFocus= {() => this.activeInput('timeOut')}
                                            value= {this.state.timeOut}
                                        />
                                    </Item>
                                </View>
                                {this.createUI()}

                                <View style={[styles.overHidden, styles.rowGroup]}>
                                    <TouchableOpacity
                                        style       = {[ styles.marginVertical_10 , styles.Width_100, styles.height_50 , styles.paddingHorizontal_20, styles.paddingVertical_10 , styles.rowGroup, styles.Border, styles.border_gray]}
                                        onPress     = {this.addClick.bind(this)}
                                    >
                                        <Text style={[styles.textRegular, styles.textSize_14]}>
                                            { i18n.t('adding') }
                                        </Text>
                                        <Icon style={[styles.textSize_20, styles.text_light_gray]} type="AntDesign" name='plus' />
                                    </TouchableOpacity>

                                </View>



                               {this.renderConfirm()}

                                <TouchableOpacity style={[ styles.marginVertical_10, styles.Width_100, styles.rowCenter ]} onPress={() => this.props.navigation.navigate('NewProduct')}>
                                    <Text style={[ styles.textRegular , styles.text_red, styles.textSize_14, styles.textDecoration ]}>
                                        { i18n.t('neworder') }
                                    </Text>
                                </TouchableOpacity>

                            </Form>
                            </KeyboardAvoidingView>

                        </View>
                    </View>

                </Content>

            </Container>

        );
    }
}


const mapStateToProps = ({ auth, profile, lang , categories}) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang,
        categories: categories.categories,
    };
};
export default connect(mapStateToProps, {getCategories , addMeal})(AddProduct);

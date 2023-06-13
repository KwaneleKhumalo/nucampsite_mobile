import { useState } from "react"
import { FlatList, StyleSheet, Text, View, Button, Modal } from "react-native"
import { Rating, Input } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"
import { useSelector, useDispatch } from "react-redux"
import RenderCampsite from "../features/campsites/RenderCampsite"
import { postComment, addComment } from "../features/comments/commentsSlice"
import { toggleFavorite } from "../features/favorites/favoritesSlice"

const CampsiteInfoScreen = ({ route }) => {
  const dispatch = useDispatch()
  const { campsite } = route.params
  const comments = useSelector(state => state.comments)

  const favorites = useSelector(state => state.favorites)
  const [showModal, setShowModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [author, setAuthor] = useState("")
  const [text, setText] = useState("")

  const handleSubmit = () => {
    const newComment = {
      author,
      rating,
      text,
      campsiteId: campsite.id
    }
    console.log(newComment)
    dispatch(postComment(newComment))
    setShowModal(!showModal)
  }

  const resetForm = () => {
    setRating(5)
    setAuthor("")
    setText("")
  }

  const renderCommentItem = ({ item }) => {
    return (
      <View style={styles.commentItem}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating startingValue={item.rating} imageSize={10} style={{ alignItems: "flex-start", paddingVertical: "5%" }} readonly />
        <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    )
  }

  return (
    <>
      <FlatList
        data={comments.commentsArray.filter(comment => comment.campsiteId === campsite.id)}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{
          marginHorizontal: 20,
          paddingVertical: 20
        }}
        ListHeaderComponent={
          <>
            <RenderCampsite campsite={campsite} isFavorite={favorites.includes(campsite.id)} markFavorite={() => dispatch(toggleFavorite(campsite.id))} onShowModal={() => setShowModal(!showModal)} />
            <Text style={styles.commentsTitle}>Comments</Text>
          </>
        }
      />
      <Modal animationType="slide" transparent={false} visible={showModal} onRequestClose={() => setShowModal(!showModal)}>
        <View style={styles.modal}>
          {/* rating goes in here */}
          <Rating showRating startingValue={rating} size={40} onFinishRating={rating => setRating(rating)} style={{ paddingVertical: 10 }} />
          {/* Inputs will go here */}
          <Input placeholder="Author" leftIcon={{ type: "font-awesome", name: "user-o" }} value={author} onChangeText={author => setAuthor(author)} leftIconContainerStyle={{ paddingRight: 10 }} />
          <Input placeholder="Comment" leftIcon={{ type: "font-awesome", name: "comment-o" }} value={text} onChangeText={text => setText(text)} leftIconContainerStyle={{ paddingRight: 10 }} />
          <View style={{ margin: 10 }}>
            <Button
              title="Submit"
              color={"#5637DD"}
              onPress={() => {
                handleSubmit()
                resetForm()
              }}
            />
          </View>

          <View style={{ margin: 10 }}>
            <Button
              onPress={() => {
                setShowModal(!showModal)
                resetForm()
              }}
              color={"#808080"}
              title="cancel"
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  commentsTitle: {
    textAlign: "center",
    backgroundColor: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    color: "#43484D",
    padding: 10,
    paddingTop: 30
  },
  commentItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff"
  },
  modal: {
    justifyContent: "center",
    margin: 20
  }
})

export default CampsiteInfoScreen

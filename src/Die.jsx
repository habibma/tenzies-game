
const Die = (props) => {

    let backgroundImage;
    if (!props.darkMode) {
        backgroundImage = props.diceType ==="dots" && `url(/dice-${props.value}.png)`
    } else {
        backgroundImage = props.diceType ==="dots" && `url(/dice-white-${props.value}.png)`
    }

    const styles = {
        backgroundColor: props.isHeld && "#59E391",
        backgroundImage,
        backgroundSize: 'contain'
    }
    return (
        <div className="die-face"
             style={styles}
             onClick={() => props.handleHold(props.id)}
        >
            <h2 className="die-num">{props.diceType ==="numbers" && props.value}</h2>
        </div>
    )
}

export default Die;
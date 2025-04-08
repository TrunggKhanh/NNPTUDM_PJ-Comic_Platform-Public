const RandomComicSection = ({ handleRandomSelect }) => {
    return (
        <div className="main__right ">
            <div className="main__random bg ">
                <div className="item-content sections">
                    <div className="content">
                        <a href="#" onClick={handleRandomSelect}>Hôm nay đọc gì?</a>
                    </div>
                    <div className="item-des">
                        <p>Nếu bạn không biết đọc gì hôm nay. Hãy để tôi chọn cho bạn</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RandomComicSection;

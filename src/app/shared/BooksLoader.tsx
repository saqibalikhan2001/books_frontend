export const BooksLoader=({size,directionSize})=>{
    return(
        <div className="loader_icon" style={{height:directionSize}}>
        <img
          style={{width:size}}
          width="100px"
          alt="loader icon"
          src="https://s3.us-west-2.amazonaws.com/ims-development/static/media/loader.gif"
        />
      </div>
    )
}
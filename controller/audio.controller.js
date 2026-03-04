const fs = require('fs');
const path = require('path');
const Bookschema=require('../schema/book.schema');

const stream = async (req, res) => {
    try {
        const { bookid } = req.params;

        const foundedBook = await Bookschema.findById(bookId);
        if (!foundedBook) {
            return res.status(404).json({ message: 'Kitob topilmadi' });
        }

        if(!foundedBook.audioUrl){
            return res.status(404).json({ message: 'Audio url topilmadi' });
        }

        const fileUrl= path.join(__dirname, '..', foundedBook.audioUrl);
        const stat = fs.statSync(fileUrl);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(fileUrl, { start, end });
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "audio/mpeg"
            });
            file.pipe(res);

            
        } else {
            res.writeHead (200, {"accept-ranges": "bytes",
                 "content-length": fileSize, 
                 "content-type": "audio/mpeg"});
          fs.createReadStream(fileUrl).pipe(res);
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { stream
};
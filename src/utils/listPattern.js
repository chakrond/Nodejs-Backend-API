if (req.query.month) {

    const parts = req.query.month

    const data = await Data.find({ recDate: { $gte: new Date(parts + '-01'), $lte: new Date(parts + '-31') }, owner: req.userInfo._id })

    if (!data) {
        return res.status(404).send()
    }

    // Map data
    const example = data[0].dataArray[0]
    const datajson = JSON.parse(JSON.stringify(example))
    delete datajson._id
    const keyNames = Object.keys(datajson)

    // Create nested array
    const combArray = Array(keyNames.length).fill().map(() => Array()) // Optional: let arr = Array.from(Array(m), () => new Array(n));

    for (let i = 0; i < keyNames.length; i++) {

        data.flatMap((a) => {
            return a.dataArray.map((b) => {
                return combArray[i].push(b[keyNames[i]])
            })
        })
    }

    // splice insert keynames at index 0
    combArray.splice(0, 0, keyNames)

    res.status(200).send(combArray)
}
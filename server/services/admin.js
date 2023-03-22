const Farmer = require('../models/farmers')
const Farm = require('../models/farms')
const User = require('../models/users')
const Agreement = require('../models/agreements')
const Audit = require('../models/audit')
const StageAgreement = require('../models/stageAgreement')
const StageFarmer = require('../models/stageFarmer')
const StageFarm = require('../models/stageFarm')
const csvToJson = require('../utils/csvToJson')
const farmerSchemaCheck = require('../utils/farmerSchemaCheck')
const farmSchemaCheck = require('../utils/farmSchemaCheck')
const agreementSchemaCheck = require('../utils/agreementSchemaCheck')
const mongoose = require('mongoose')

const getEnvVariable = require("../config/privateketAWS");

// Calling function to get the privateKey from aws params storage
async function getPrivateKeyAWS(keyName) {
  const privateKeyValue = await getEnvVariable(keyName);
  // return
  return privateKeyValue[`${keyName}`];
}

// Importig PinataSDK For IPFS
const pinataSDK = require('@pinata/sdk')
const pinata = new pinataSDK({ pinataJWTKey: process.env.IPFS_BEARER_TOKEN })
const epocTimeConv = require('../utils/epocTimeConv')
const validator = require('validator')

// Import for Blockchain
const Web3 = require('web3')
const farmNFTContractABI = require('../web3/farmContractABI')
const marketplaceContractABI = require('../web3/marketPlaceABI')

// const mintFarm = require("../web3/mintFarm");

const Private_Key = process.env.PRIVATE_KEY
const adminAddr = process.env.ADMIN_ADDR
const farmNFTAddr = process.env.FARM_NFT_ADDR
const marketplaceAddr = process.env.MARKETPLACE_ADDR
const provider = new Web3.providers.WebsocketProvider(process.env.RPC_URL)

const web3 = new Web3(provider)
const farmNFTContract = new web3.eth.Contract(farmNFTContractABI, farmNFTAddr)

const marketplaceContract = new web3.eth.Contract(
  marketplaceContractABI,
  marketplaceAddr,
)

// Validate the agreement
exports.validate = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  if (!req.files || !req.files.file) {
    response.error = 'no file selected'
    response.httpStatus = 400
  } else {
    // Read the contents of the file
    // const fileContent = req.files.file.data.toString(); //JSON DATA
    const file = req.files.file
    // Parse the JSON data
    // const data = JSON.parse(fileContent); //JSON DATA
    const data = await csvToJson(file)
    //console.log("data :- ", data);
    const isValid = await agreementSchemaCheck(data)
    // Check file type
    if (file.mimetype != 'text/csv') {
      response.error = 'select csv file'
      response.httpStatus = 400
    } else if (!isValid) {
      // Check schema of the file
      response.error = 'data format do not match, download sample'
      response.httpStatus = 400
    } else {
      const errorLines = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        let errors = {
          line: i,
          farmer_name: '',
          crop: '',
          start_date: '',
          end_date: '',
          area: '',
          price: '',
          farm_id: '',
          farm_nft_id: '',
          address: '',
        }

        if (!item.farmer_name && item.farmer_name.length >= 3) {
          errors.name = 'Name should be 3 characters long'
        }

        if (item.start_date) {
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/
          if (!dateRegex.test(item.start_date)) {
            errors.start_date = 'Start date should be in the format of dd/mm/yy'
          }
        }

        if (item.end_date) {
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/
          if (!dateRegex.test(item.end_date)) {
            errors.end_date = 'End date should be in the format of dd/mm/yy'
          }
        }
        if (epocTimeConv(item.start_date) > epocTimeConv(item.end_date)) {
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/
          if (
            !dateRegex.test(item.end_date) ||
            !dateRegex.test(item.start_date)
          ) {
            errors.start_date =
              'Start date & end date should be in the format of dd/mm/yy'
          } else {
            errors.end_date = 'Start date should be less than end date'
          }
        }

<<<<<<< HEAD
        if (item.price && isNaN(item.price && item.price % 1 !== 0)) {
          errors.price = 'Price should be a number'
=======
        if (
          !item.price ||
          isNaN(item.price) ||
          parseInt(item.price % 1 !== 0) ||
          !Number.isInteger(parseFloat(item.price))
        ) {
          errors.price = "Price should be a number";
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
        }

        if (!item.area || isNaN(item.area.split(" ")[0])) {
          errors.area = "area is not a number";
        } else if (!item.area.includes("Acres")) {
          errors.area = "area should be in Acres like 1 Acres";
        }

        // Check for missing fields and add them to the errors object for this item
        const requiredFields = [
          'farmer_name',
          'crop',
          'start_date',
          'end_date',
          'area',
          'price',
          'farm_id',
          'farm_nft_id',
          'address',
        ]

        for (const field of requiredFields) {
          if (!item[field]) {
            errors[field] = `Missing '${field}' field`
          }
        }
        let farm
        try {
          // Check for farm_id is not there.

          const farmNFTId = item.farm_nft_id
          farm = await Farm.findOne({ _id: item.farm_id })
          if (farm) {
            if (farm.farm_nft_id != farmNFTId) {
              errors.farm_nft_id = 'farm_nft_id not matching with farm'
            }
          } else {
            errors.farm_id = 'farm not found'
          }
        } catch (err) {
          if (err instanceof mongoose.CastError) {
            errors.farm_id = 'Invalid farm ID'
          }
        }
        if (
          errors.farmer_name ||
          errors.crop ||
          errors.start_date ||
          errors.end_date ||
          errors.area ||
          errors.price ||
          errors.farm_id ||
          errors.farm_nft_id ||
          errors.address
        ) {
          errorLines.push(errors)
        }
      }

      if (errorLines.length >= 1) {
        // There are error some lines missing data
        ;(response.httpStatus = 400), (response.error = errorLines)
      } else {
        // No error
        if (data.length == 0) {
          response.httpStatus = 400
          response.error = 'Empty File'
        } else {
          // No error
          response.httpStatus = 200
          response.message = 'validation successful'
          response.data = data
        }
      }
      response.data = data
    }
  }
  return response
}

// Stage the agreement
exports.stagedAgreements = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  if (!req.files || !req.files.file) {
    response.error = 'no file selected'
    response.httpStatus = 400
  } else {
    try {
      const file = req.files.file
      //console.log("file Name :- ", file);

      // Check file type
      if (file.mimetype != 'text/csv') {
        response.error = 'select csv file'
        response.httpStatus = 400
      } else {
        const data = await csvToJson(file)
        // Add the file name to each data object

        // if Same file name do not exist
        const fileExist = await StageAgreement.find({ file_name: file.name })

        let updatedData
        if (fileExist.length <= 0) {
          updatedData = data.map((eachdata) => {
            return { ...eachdata, file_name: file.name }
          })
          // Insert record into DB (stageAgreement)
          const stageAgreement = await StageAgreement.create(updatedData)

          response.httpStatus = 200
          response.message = 'Insertion successful'
          response.data = stageAgreement
        } else {
          response.httpStatus = 400
          response.message = 'file name, already exist.'
        }
      }
    } catch (error) {
      response.error = `failed operation ${error}`
      response.httpStatus = 500
    }
  }
  return response
}

// Get staged agreement
exports.getStagedAgreements = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }
  try {
    // read the data {stage_status:true}, all the data in stage state
    const stageAgreementpending = await StageAgreement.find({
      stage_status: true,
      approval_status: false,
    }).select('-createdAt -updatedAt -__v -stage_status -approval_status')
    // Note :- while inserting update the status to approval_status true
    // if approval status true ,stage_staus:true means this data should be
    // inserted into the Agreement table.

    const groupedData = {}
    stageAgreementpending.forEach((agreement) => {
      if (!groupedData[agreement.file_name]) {
        groupedData[agreement.file_name] = []
      }
      groupedData[agreement.file_name].push(agreement)
    })

    const dataArray = Object.entries(groupedData).map(
      ([fileName, agreements]) => ({
        name: fileName,
        data: agreements,
      }),
    )

    response.httpStatus = 200
    response.data = dataArray.length > 0 ? dataArray : []
  } catch (error) {
    response.error = `operation failed ${error}`
    response.httpStatus = 500
  }
  return response
}

// Get Agreement List for admin with Pagination
exports.listAgreements = async (req) => {
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const skip = (page - 1) * limit

  const searchQuery = {}

  if (req.query.search) {
    const searchValue = req.query.search
    searchQuery['$or'] = [
      { farmer_name: new RegExp(req.query.search, 'i') },
      {
        crop: new RegExp(req.query.search, 'i'),
      },
    ]
  }

  try {
    let agreementQuery = Agreement.find(searchQuery)
    let totalDocuments = await Agreement.countDocuments(searchQuery)

    if (isNaN(page) && isNaN(limit)) {
      // Return all documents
      const agreements = await agreementQuery.select('-__v')

      response.data = agreements
      response.httpStatus = 200
    } else {
      // Apply pagination
      const agreements = await agreementQuery
        .skip(skip)
        .limit(limit)
        .select('-__v ')
      response.httpStatus = 200
      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: agreements.map((agreement) => ({
          ...agreement._doc,
          createdAt: agreement.createdAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
          updatedAt: agreement.updatedAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
        })),
      }
    }
  } catch (error) {
    ;(response.error = 'failed operation'), (response.httpStatus = 400)
  }
  return response
}

// Update Agreement Service ::
exports.updateAgreement = async (req) => {
<<<<<<< HEAD
  const userLogged = req.user
=======
  console.log("updateAgreement :- ", updateAgreement);
  const userLogged = req.user;
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

<<<<<<< HEAD
  const { id } = req.params
=======
  const { id } = req.params;
  // Getting private From aws params store
  // const Private_Key = await getPrivateKeyAWS("agritect-private-key");
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5

  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }
  //Checking header reason for change
  const reason = req.headers['reason']

  const updatedData = req.body
  try {
    // First check agreement is their with id and not active
    let agreement = await Agreement.findOne({ _id: id, sold_status: false })

    if (agreement) {
      // Update the Agreement data..
      await Agreement.updateOne({ _id: id }, updatedData)

      const old_values = {}
      const new_values = {}
      for (const key in updatedData) {
        // only log fields that are actually changing
        if (key in agreement && agreement[key] !== updatedData[key]) {
          old_values[key] = agreement[key]
          new_values[key] = updatedData[key]
          agreement[key] = updatedData[key]
        }
      }

      //New value contain createdAT and updated, _id
      delete new_values.createdAt
      delete new_values.updatedAt
      delete old_values.createdAt
      delete old_values.updatedAt
      delete old_values._id
      delete new_values._id

      // Creatingg Log
      await Audit.create({
        table_name: 'agreement',
        record_id: agreement._id,
        change_type: 'update',
        // old_value: JSON.stringify(old_values),
        // new_value: JSON.stringify(new_values),
        old_value: Object.keys(old_values).length
          ? JSON.stringify(old_values)
          : null,
        new_value: Object.keys(new_values).length
          ? JSON.stringify(new_values)
          : null,
        user_id: userLogged.id,
        user_name: userLogged.name,
        change_reason: reason,
      })

      agreement = await Agreement.findOne({ _id: id, sold_status: false })
      const farm = await Farm.findOne({ farm_id: agreement.farm_id })

      const {
        file_name,
        farmer_name,
        address,
        agreement_nft_id,
        tx_hash,
        farm_nft_id,
        price,
        ipfs_url,
        createdAt,
        updatedAt,
        __v,
        ...rest
      } = agreement._doc

      rest.farmer_id = farm.farmer_id
      rest.location = farm.location

      const options = {
        pinataMetadata: {
          name: agreement.farm_nft_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options)
      const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`
      agreement.ipfs_url = ipfs_hash
      await agreement.save()

      // -------------- IPFS --------------------

      // BLOCKCHAIN TRANSACTION--------------------
      const amount = req.body.price ? req.body.price : agreement.price
      const startDate = req.body.start_date
        ? req.body.start_date
        : agreement.start_date
      const endDate = req.body.start_date
        ? req.body.end_date
        : agreement.end_date

      const Tran = 'https://mumbai.polygonscan.com/tx'
      const agreement_nftId = agreement.agreement_nft_id

      const gasLimit = await marketplaceContract.methods
        .updateAgreementData(
          agreement_nftId,
          amount,
          epocTimeConv(startDate),
          epocTimeConv(endDate),
          ipfs_hash,
        )
        .estimateGas({ from: adminAddr })

      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2),
      )

      const updateContract = marketplaceContract.methods
        .updateAgreementData(
          agreement_nftId,
          amount,
          epocTimeConv(startDate),
          epocTimeConv(endDate),
          ipfs_hash,
        )
        .encodeABI()

      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: marketplaceAddr,
        value: '0x00',
        data: updateContract,
        from: adminAddr,
      }

      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key)

      const transaction = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      )

      agreement.tx_hash = `${Tran}/${transaction.transactionHash}`

      await agreement.save()

      if (transaction.transactionHash) {
        response.message = `Successfully updated `
        response.httpStatus = 200
      } else {
        response.message = `Blockchain error `
        response.httpStatus = 500
      }
    } else {
      response.error = `agreement is active`
      response.httpStatus = 404
    }
  } catch (error) {
    response.error = `failed operation ${error}`
    response.httpStatus = 500
  }
  return response
}

<<<<<<< HEAD
exports.updateAgreementOld = async (req) => {
  const userLogged = req.user
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params

  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }
  //Checking header reason for change
  const reason = req.headers['reason']

  const updatedData = req.body
  try {
    // First check agreement is their with id and not active
    let agreement = await Agreement.findOne({ _id: id, sold_status: false })

    if (agreement) {
      // Update the Agreement data..
      await Agreement.updateOne({ _id: id }, updatedData)

      const old_values = {}
      const new_values = {}
      for (const key in updatedData) {
        // only log fields that are actually changing
        if (key in agreement && agreement[key] !== updatedData[key]) {
          old_values[key] = agreement[key]
          new_values[key] = updatedData[key]
          agreement[key] = updatedData[key]
        }
      }

      //New value contain createdAT and updated, _id
      delete new_values.createdAt
      delete new_values.updatedAt
      delete old_values.createdAt
      delete old_values.updatedAt
      delete old_values._id
      delete new_values._id

      // Creatingg Log
      await Audit.create({
        table_name: 'agreement',
        record_id: agreement._id,
        change_type: 'update',
        // old_value: JSON.stringify(old_values),
        // new_value: JSON.stringify(new_values),
        old_value: Object.keys(old_values).length
          ? JSON.stringify(old_values)
          : null,
        new_value: Object.keys(new_values).length
          ? JSON.stringify(new_values)
          : null,
        user_id: userLogged.id,
        user_name: userLogged.name,
        change_reason: reason,
      })

      agreement = await Agreement.findOne({ _id: id, sold_status: false })

      const {
        _id,
        farm_id,
        file_name,
        farmer_name,
        address,
        agreement_nft_id,
        tx_hash,
        farm_nft_id,
        price,
        ipfs_url,
        ...rest
      } = agreement._doc

      const options = {
        pinataMetadata: {
          name: agreement.farm_nft_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options)
      const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`
      agreement.ipfs_url = ipfs_hash
      await agreement.save()

      // -------------- IPFS --------------------

      // BLOCKCHAIN TRANSACTION--------------------
      const amount = req.body.price ? req.body.price : agreement.price
      const startDate = req.body.start_date
        ? req.body.start_date
        : agreement.start_date
      const endDate = req.body.start_date
        ? req.body.end_date
        : agreement.end_date

      const Tran = 'https://mumbai.polygonscan.com/tx'
      const agreement_nftId = agreement.agreement_nft_id

      const gasLimit = await marketplaceContract.methods
        .updateAgreementData(
          agreement_nftId,
          amount,
          epocTimeConv(startDate),
          epocTimeConv(endDate),
          ipfs_hash,
        )
        .estimateGas({ from: adminAddr })

      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2),
      )

      const updateContract = marketplaceContract.methods
        .updateAgreementData(
          agreement_nftId,
          amount,
          epocTimeConv(startDate),
          epocTimeConv(endDate),
          ipfs_hash,
        )
        .encodeABI()

      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: marketplaceAddr,
        value: '0x00',
        data: updateContract,
        from: adminAddr,
      }

      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key)

      const transaction = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      )
      agreement.tx_hash = `${Tran}/${transaction.transactionHash}`

      if (transaction.transactionHash) {
        response.message = `Successfully updated `
        response.httpStatus = 200
      } else {
        response.message = `Blockchain error `
        response.httpStatus = 500
      }
    } else {
      response.error = `agreement is active`
      response.httpStatus = 404
    }
  } catch (error) {
    response.error = `failed operation ${error}`
    response.httpStatus = 500
  }
  return response
}

=======
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
// Delete Agreement Service /:id
exports.deleteAgreement = async (req) => {
  const userLogged = req.user
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params

  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }

  //reading reason from header
  const reason = req.headers['reason']

  try {
    // First check agreement is their with id
    const agreement = await Agreement.findOne({
      _id: id,
    })

    if (agreement) {
      // delete the agreement not active one
      const checkAgreement = await Agreement.deleteOne({
        _id: id,
        sold_status: false,
      })

      if (checkAgreement.deletedCount) {
        // Update log only when deleted..
        const old_values = 'No change'
        const new_values = 'No change'
        await Audit.create({
          table_name: 'agreement',
          record_id: agreement.id,
          change_type: 'delete',
          old_value: old_values,
          new_value: new_values,
          user_id: userLogged.id,
          user_name: userLogged.name,
          change_reason: reason,
        })

        response.message = `Successfully deleted`
        response.httpStatus = 200
      } else {
        response.error = `agreement is active`
        response.httpStatus = 400
      }
    } else {
      response.error = `agreement not found`
      response.httpStatus = 404
    }
  } catch (error) {
    response.error = `failed operation ${error}`
    response.httpStatus = 500
  }
  return response
}

exports.validateFarmersOld = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  if (!req.files || !req.files.file) {
    response.error = 'no file selected'
    response.httpStatus = 400
  } else {
    // Read the contents of the file
    const file = req.files.file
    // Parse the JSON data
    // const data = JSON.parse(fileContent); //JSON DATA
    const data = await csvToJson(file)

    // Check file type
    if (file.mimetype != 'text/csv') {
      response.error = 'select csv file'
      response.httpStatus = 400
    } else if (!farmerSchemaCheck(data)) {
      // Check schema of the file
      response.error = 'data format do not match, download sample'
      response.httpStatus = 400
    } else {
      const errorLines = []
      // Creating List of errors.
      const uniquePhones = new Set()
      const uniqueEmails = new Set()

      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        let errors = {
          line: i,
          name: '',
          email: '',
          phone: '',
          pin: '',
          rating: '',
          education: '',
          address: '',
          image_url: '',
          farmer_pdf: '',
        }

        if (uniquePhones.has(item.phone)) {
          errors.phone = 'Phone number already exists in the file'
        } else {
          uniquePhones.add(item.phone)
        }

        if (uniqueEmails.has(item.email)) {
          errors.email = 'Email already exists in the file'
        } else {
          uniqueEmails.add(item.email)
        }

        if (!item.name && item.name.length >= 3) {
          errors.name = 'Name should be 3 characters long'
        }

        if (
          !item.email ||
          !item.email.includes('@') ||
          !item.email.endsWith('.com')
        ) {
          errors.email = "Email should contain '@' and end with '.com'"
        }

        if (
          !item.rating ||
          isNaN(item.rating) ||
          item.rating < 1 ||
          item.rating > 10
        ) {
          errors.rating = "rating should be a number between 1 and 10";
        }

        if (
          !item.phone ||
          isNaN(item.phone) ||
          !/^\d+$/.test(item.phone) ||
          item.phone.length !== 10
        ) {
          errors.phone = 'Phone should be of length of 10.'
        }

        if (!item.pin || !/^\d+$/.test(item.pin) || item.pin.length !== 6) {
          errors.pin = 'PIN should be 6 characters long'
        }

        if (!item.image_url || !item.image_url.startsWith('https://')) {
          errors.image_url =
            "Invalid image URL format. Must start with 'https://'"
        }

        if (!item.image_url || !/(jpeg|jpg|png)$/.test(item.image_url)) {
          errors.image_url =
            "Invalid image URL format. Must end with '.jpeg', '.jpg', or '.png'"
        }

        if (
<<<<<<< HEAD
          !item.farmer_pdf &&
          !item.farmer_pdf.startsWith('https://') &&
          !item.farmer_pdf.endsWith('.pdf')
        ) {
          errors.farmer_pdf = "Farmer PDF should start with 'https://'"
=======
          !item.farmer_pdf ||
          !item.farmer_pdf.startsWith("https://") ||
          !item.farmer_pdf.endsWith(".pdf")
        ) {
          errors.farmer_pdf =
            "Farmer PDF should start with 'https://' and end with .pdf";
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
        }

        // Check for missing fields and add them to the errors object for this item
        const requiredFields = [
          'name',
          'email',
          'address',
          'phone',
          'pin',
          'rating',
          'education',
          'address',
          'image_url',
          'farmer_pdf',
        ]
        for (const field of requiredFields) {
          if (!item[field]) {
            errors[field] = `Missing '${field}' field`
          }
        }

        // Check for duplicate phone and email in DB
        const farmerInDbPhone = await Farmer.find({ phone: item.phone })
        const farmerInDbEmail = await Farmer.find({ email: item.email })

        if (farmerInDbPhone.length !== 0 && farmerInDbEmail.length !== 0) {
          errors.phone = 'Phone already exists'
          errors.email = 'Email already exists'
        } else if (farmerInDbEmail.length !== 0) {
          errors.email = 'Email already exists'
        } else if (farmerInDbPhone.length !== 0) {
          errors.phone = 'Phone already exists'
        }

        if (
          errors.name ||
          errors.email ||
          errors.phone ||
          errors.pin ||
          errors.address ||
          errors.rating ||
          errors.education ||
          errors.image_url ||
          errors.farmer_pdf
        ) {
          errorLines.push(errors)
        }
      }

      if (errorLines.length >= 1) {
        // There are error some lines missing data
        ;(response.httpStatus = 400),
          (response.error = errorLines),
          (response.data = data)
      } else {
        // check if the empty file
        if (data.length == 0) {
          response.httpStatus = 400
          response.error = 'Empty File'
          response.data = data
        } else {
          // No error
          response.httpStatus = 200
          response.message = 'validation successful'
          response.data = data
        }
      }
    }
  }
  return response
}

exports.validateFarmers = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  if (!req.files || !req.files.file) {
    response.error = 'no file selected'
    response.httpStatus = 400
  } else {
<<<<<<< HEAD
    try {
      const file = req.files.file
      //console.log("file Name :- ", file);

      // Check file type
      if (file.mimetype != 'text/csv') {
        response.error = 'select csv file'
        response.httpStatus = 400
      } else {
        const data = await csvToJson(file)
        // Add the file name to each data object
=======
    // Read the contents of the file
    const file = req.files.file;
    // Parse the JSON data
    // const data = JSON.parse(fileContent); //JSON DATA
    const data = await csvToJson(file);
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5

    // Check file type
    if (file.mimetype != "text/csv") {
      response.error = "select csv file";
      response.httpStatus = 400;
    } else if (!farmerSchemaCheck(data)) {
      // Check schema of the file
      response.error = "data format do not match, download sample";
      response.httpStatus = 400;
    } else {
      const errorLines = [];
      // Creating List of errors.
      const uniquePhones = new Set();
      const uniqueEmails = new Set();

<<<<<<< HEAD
        const fileExist = await StageFarmer.find({ file_name: file.name })

        let updatedData
        if (fileExist.length <= 0) {
          updatedData = data.map((eachdata) => {
            return { ...eachdata, file_name: file.name }
          })
          // Insert record into DB (stageFarmer)
          // console.log("updatedData :- ", updatedData);
          const stageFarmer = await StageFarmer.create(updatedData)

          response.httpStatus = 200
          response.message = 'Insertion succeesful'
          response.data = stageFarmer
        } else {
          response.httpStatus = 400
          response.message = 'file name, already exist.'
=======
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let errors = {
          line: i,
          name: "",
          email: "",
          phone: "",
          pin: "",
          rating: "",
          education: "",
          address: "",
          image_url: "",
          farmer_pdf: "",
        };
        item.phone = item.phone.trim();

        if (uniquePhones.has(item.phone)) {
          errors.phone = "Phone number already exists in the file";
        } else {
          uniquePhones.add(item.phone);
        }

        if (uniqueEmails.has(item.email)) {
          errors.email = "Email already exists in the file";
        } else {
          uniqueEmails.add(item.email);
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
        }

        if (!item.name && item.name.length >= 3) {
          errors.name = "Name should be 3 characters long";
        }

        if (
          !item.email ||
          !item.email.includes("@") ||
          !item.email.endsWith(".com")
        ) {
          errors.email = "Email should contain '@' and end with '.com'";
        }

        let phoneError = false;
        if (
          !item.phone ||
          !/^\d+$/.test(item.phone) ||
          item.phone?.length < 10 ||
          item.phone?.length > 10
        ) {
          phoneError = true;
          errors.phone =
            "Phone should be of length of 10 and only contain numeric value.";
        }

        if (!item.pin || !/^\d+$/.test(item.pin) || item.pin.length !== 6) {
          errors.pin = "PIN should be 6 characters long";
        }

        if (
          !item.rating ||
          isNaN(item.rating) ||
          item.rating < 1 ||
          item.rating > 10
        ) {
          errors.rating = "Rating should be a number between 1 and 10";
        }

        if (!item.image_url || !item.image_url.startsWith("https://")) {
          errors.image_url =
            "Invalid image URL format. Must start with 'https://'";
        }

        if (!item.image_url || !/(jpeg|jpg|png)$/.test(item.image_url)) {
          errors.image_url =
            "Invalid image URL format. Must end with '.jpeg', '.jpg', or '.png'";
        }

        if (
          !item.farmer_pdf &&
          !item.farmer_pdf.startsWith("https://") &&
          !item.farmer_pdf.endsWith(".pdf")
        ) {
          errors.farmer_pdf = "Farmer PDF should start with 'https://'";
        }

        // Check for missing fields and add them to the errors object for this item
        const requiredFields = [
          "name",
          "email",
          "address",
          "phone",
          "pin",
          "rating",
          "education",
          "address",
          "image_url",
          "farmer_pdf",
        ];
        for (const field of requiredFields) {
          if (!item[field]) {
            errors[field] = `Missing '${field}' field`;
          }
        }

        // Check for duplicate phone and email in DB
        let farmerInDbPhone = undefined;
        if (!phoneError) {
          farmerInDbPhone = await Farmer.findOne({ phone: item.phone });
        }
        const farmerInDbEmail = await Farmer.findOne({ email: item.email });

        if (farmerInDbPhone && farmerInDbEmail) {
          errors.phone = "Phone already exists";
          errors.email = "Email already exists";
        } else if (farmerInDbEmail) {
          errors.email = "Email already exists";
        } else if (farmerInDbPhone) {
          console.log(phoneError, farmerInDbPhone);
          errors.phone = "Phone already exists";
        }

        if (
          errors.name ||
          errors.email ||
          errors.phone ||
          errors.pin ||
          errors.address ||
          errors.rating ||
          errors.education ||
          errors.image_url ||
          errors.farmer_pdf
        ) {
          errorLines.push(errors);
        }
      }

      if (errorLines.length >= 1) {
        // There are error some lines missing data
        response.httpStatus = 400;
        response.error = errorLines;
        response.data = data;
      } else {
        // check if the empty file
        if (data.length == 0) {
          response.httpStatus = 400;
          response.error = "Empty File";
          response.data = data;
        } else {
          // No error
          response.httpStatus = 200;
          response.message = "validation successful";
          response.data = data;
        }
      }
    }
  }
  return response;
};

exports.stagedFarmers = async (req) => {
  // General response format

  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  };

  if (!req.files || !req.files.file) {
    response.error = "no file selected";
    response.httpStatus = 400;
  } else {
    try {
      const file = req.files.file;
      //console.log("file Name :- ", file);

      // Check file type
      if (file.mimetype != "text/csv") {
        response.error = "select csv file";
        response.httpStatus = 400;
      } else {
        const data = await csvToJson(file);
        // Add the file name to each data object

        // if Same file name do not exist

        const fileExist = await StageFarmer.find({ file_name: file.name });

        let updatedData;
        if (fileExist.length <= 0) {
          updatedData = data.map((eachdata) => {
            return { ...eachdata, file_name: file.name };
          });
          // Insert record into DB (stageFarmer)
          // console.log("updatedData :- ", updatedData);
          const stageFarmer = await StageFarmer.create(updatedData);

          response.httpStatus = 200;
          response.message = "Insertion succeesful";
          response.data = stageFarmer;
        } else {
          response.httpStatus = 400;
          response.message = "file name, already exist.";
        }
      }
    } catch (error) {
      response.error = `failed operation ${error}`
      response.httpStatus = 500
    }
  }
  return response
}

exports.getStagedFarmers = async (req) => {
  // General response format

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }
  try {
    // read the data {stage_status:true}, all the data in stage state
    const stageFarmerpending = await StageFarmer.find({
      stage_status: true,
      approval_status: false,
    }).select('-createdAt -updatedAt -__v -stage_status -approval_status')
    // Note :- while inserting update the status to approval_status true
    // if approval status true ,stage_staus:true means this data should be
    // inserted into the Agreement table.

    const groupedData = {}
    stageFarmerpending.forEach((farmer) => {
      if (!groupedData[farmer.file_name]) {
        groupedData[farmer.file_name] = []
      }
      groupedData[farmer.file_name].push(farmer)
    })

    const dataArray = Object.entries(groupedData).map(
      ([fileName, farmers]) => ({
        name: fileName,
        data: farmers,
      }),
    )

    response.httpStatus = 200
    response.data = dataArray.length > 0 ? dataArray : []
  } catch (error) {
    response.error = `operation failed ${error}`
    response.httpStatus = 500
  }
  return response
}

exports.createFarmer = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }

  // Save Farm data in mongoDB , skip id,s.no key in json
  try {
    const data = req.body

    // status RESET stage table
    data.map(async (farmer) => {
      await StageFarmer.updateOne(
        { _id: farmer._id },
        { stage_status: false, approval_status: true },
      )
    })

    const farmers = await Farmer.create(data, {
      select: `-_id -stage_status -approval_status -file_name`,
    })

    console.log('data 12 :- ', data)
    // Removing from staging stable
    data.map(async (farmer) => {
      await StageFarmer.deleteOne({ _id: farmer._id, stage_status: false })
    })

    if (farmers.length != 0) {
      response.message = 'Data Insertion successful'
      response.httpStatus = 201
      response.data = farmers
    } else {
      response.error = 'Data Insertion failed, duplicate data'
      response.httpStatus = 500
    }
  } catch (error) {
    response.error = `Insertion failed ${error}`
    response.httpStatus = 500
  }
  return response
}

// Update Farmer Service
exports.updateFarmer = async (req) => {
  // Getting user from middleware
  const userLogged = req.user
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params
  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }
  //Checking header reason for change
  const reason = req.headers['reason']

  const updatedData = req.body

  // Validation

  try {
    // Define validation rules for updatedData
    const validationRules = {
      name: { type: 'string', minLength: 3, maxLength: 50 },
      address: { type: 'string', minlegth: 5, maxlength: 200 },
      pin: { type: 'number', minLength: 6, maxLength: 6 },
      phone: { type: 'number', minLength: 10, maxLength: 10 },
      email: { type: 'string', format: 'email' },
      image_url: { type: 'string' },
      rating: { type: 'number' },
      education: { type: 'string' },
      farmer_pdf: { type: 'string' },
    }
    // Validate updatedData against validation rules
    if (
      updatedData.name &&
      (updatedData.name.length < 3 || updatedData.name.length > 50)
    ) {
      response.error =
        'Invalid name: name must be between 3 and 50 characters long'
      response.httpStatus = 400
      return response
    }

    if (
      updatedData.address &&
      (updatedData.address.length < 5 || updatedData.address.length > 200)
    ) {
      response.error =
        'Invalid address: address must be between 5 and 200 characters long'
      response.httpStatus = 400
      return response
    }

    if (updatedData.pin && updatedData.pin.toString().length !== 6) {
      response.error = 'Invalid pin: pin must be 6 digits long'
      response.httpStatus = 400
      return response
    }

    if (updatedData.phone && updatedData.phone.toString().length !== 10) {
      response.error = 'Invalid phone: phone number must be 10 digits long'
      response.httpStatus = 400
      return response
    }

    if (updatedData.email && !validator.isEmail(updatedData.email)) {
      response.error = 'Invalid email: email must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (updatedData.image_url && !validator.isURL(updatedData.image_url)) {
      response.error = 'Invalid image URL: image URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (typeof updatedData.rating === Number) {
      response.error = 'Invalid rating'
      response.httpStatus = 400
      return response
    }

    if (typeof updatedData.education === String) {
      response.error = 'Invalid education'
      response.httpStatus = 400
      return response
    }

    if (updatedData.farmer_pdf && !validator.isURL(updatedData.farmer_pdf)) {
      response.error =
        'Invalid farmer PDF URL: farmer PDF URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    // First check farmer is their with id
    let farmer = await Farmer.findOne({ _id: id })

    if (farmer) {
      await Farmer.updateOne({ _id: id }, updatedData)

      const old_values = {}
      const new_values = {}
      for (const key in updatedData) {
        // only log fields that are actually changing
        if (key in farmer && farmer[key] !== updatedData[key]) {
          old_values[key] = farmer[key]
          new_values[key] = updatedData[key]
          farmer[key] = updatedData[key]
        }
      }

      //New value contain createdAT and updated, _id
      delete new_values.createdAt
      delete new_values.updatedAt
      delete old_values._id
      delete new_values._id

      // Creatingg Log
      await Audit.create({
        table_name: 'farmers',
        record_id: farmer._id,
        change_type: 'update',
        old_value: Object.keys(old_values).length
          ? JSON.stringify(old_values)
          : null,
        new_value: Object.keys(new_values).length
          ? JSON.stringify(new_values)
          : null,
        user_id: userLogged.id,
        user_name: userLogged.name,
        change_reason: reason,
      })
      // creating response
      response.message = `Successfully updated`
      response.httpStatus = 200
    } else {
      response.error = `farmer not found`
      response.httpStatus = 404
    }
  } catch (error) {
    response.error = `failed operation ${error}`
    response.httpStatus = 500
  }
  return response
}

// Delete Farmer Service /:id
exports.deleteFarmer = async (req) => {
  // Getting user from middleware
  const userLogged = req.user
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params

  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }

  //Checking header reason for change
  const reason = req.headers['reason']

  try {
    // First check farmer is their with id
    const farmer = await Farmer.findOne({ _id: id }).select(
      '-__v -createdAt -updatedAt',
    )

    if (farmer) {
      // delete the farmer data..Also delete all farms, and close agreements for that farms.
      // Check if this farmer Has some farm then Delete it
      const farms = await Farm.find({ farmer_id: farmer._id })
      if (farms.length > 0) {
        response.error = `reference exist you can not delete`
        response.httpStatus = 400
      } else {
        // Old farmer
        const old_values = 'No change'
        // console.log("old_values ", old_values);
        await Farmer.deleteOne({ _id: id })
        const new_values = 'No change'
        // console.log("new_values ", new_values);
        await Audit.create({
          table_name: 'farmers',
          record_id: farmer.id,
          change_type: 'delete',
          old_value: old_values,
          new_value: new_values,
          user_id: userLogged.id,
          user_name: userLogged.name,
          change_reason: reason,
        })

        response.message = `Successfully deleted`
        response.httpStatus = 200
      }
    } else {
      response.error = `farmer not found`
      response.httpStatus = 404
    }
  } catch (error) {
    response.error = `failed operation${error}`
    response.httpStatus = 500
  }
  return response
}

// Get all farmer with page no. with search Query
exports.getFarmers = async (req) => {
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const sortOrder = req.query.sortOrder
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const skip = (page - 1) * limit
  const searchQuery = {}

  if (req.query.search) {
    const searchValue = req.query.search
    searchQuery['$or'] = [
      { name: new RegExp(req.query.search, 'i') },
      {
        pin: !isNaN(parseInt(searchValue)) ? parseInt(searchValue) : undefined,
      },
      {
        phone: !isNaN(parseInt(searchValue))
          ? parseInt(searchValue)
          : undefined,
      },
    ]
  }

  try {
    let farmerQuery = Farmer.find(searchQuery)
    let totalDocuments = await Farmer.countDocuments(searchQuery)

    if (sortOrder === 'low') {
      farmerQuery = farmerQuery.sort({ rating: 1 })
    } else if (sortOrder === 'high') {
      farmerQuery = farmerQuery.sort({ rating: -1 })
    }

    if (isNaN(page) && isNaN(limit) && !sortOrder) {
      // Return all documents
      const farmers = await farmerQuery.select('-__v')
      response.data = farmers.map((farmer) => ({
        ...farmer._doc,
        createdAt: farmer.createdAt.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
        updatedAt: farmer.updatedAt.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      }))
      response.httpStatus = 200
    } else if (isNaN(page) && isNaN(limit)) {
      // Return all documents
      const farmers = await farmerQuery.select('-__v')

      response.data = farmers
      response.httpStatus = 200
    } else {
      // Apply pagination
      const skip = (page - 1) * limit
      const farmers = await farmerQuery
        .find(searchQuery)
        .skip(skip)
        .limit(limit)
        .select('-__v')
      response.httpStatus = 200
      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: farmers.map((farmer) => ({
          ...farmer._doc,
          createdAt: farmer.createdAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
          updatedAt: farmer.updatedAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
        })),
      }
    }
  } catch (error) {
    ;(response.error = `failed operation ${error}`), (response.httpStatus = 400)
  }
  return response
}

// Validate Farm
exports.validateFarms = async (req) => {
  // General response format

  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  if (!req.files || !req.files.file) {
    response.error = 'no file selected'
    response.httpStatus = 400
  } else {
    // Read the contents of the file

    const file = req.files.file
    // Parse the JSON data
    // const data = JSON.parse(fileContent); //JSON DATA
<<<<<<< HEAD
    const data = await csvToJson(file)
=======
    const data = await csvToJson(file);

    console.log("data", data);
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
    // Check file type
    if (file.mimetype != 'text/csv') {
      response.error = 'select csv file'
      response.httpStatus = 400
    } else if (!farmSchemaCheck(data)) {
      // Check schema of the file
      response.error = 'data format do not match, download sample'
      response.httpStatus = 400
    } else {
      const errorLines = []
      // Creating List of errors.
      const uniqueLocation = new Set()

      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        let errors = {
          line: i,
<<<<<<< HEAD
          farmer_id: '',
          name: '',
          address: '',
          pin: '',
          location: '',
          farm_size: '',
          farm_pdf: '',
          farm_practice_rating: '',
          farm_practice_pdf: '',
          rating: '',
          image_url: '',
          video_url: '',
        }
=======
          farmer_id: "",
          name: "",
          address: "",
          pin: "",
          location: "",
          farm_size: "",
          farm_pdf: "",
          farm_practice_rating: "",
          farm_practice_pdf: "",
          rating: "",
          image_url: "",
          video_url: "",
          food_grains: "",
          vegetables: "",
          horticulture: "",
          floriculture: "",
          exotic_crops: "",
        };
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
        if (uniqueLocation.has(item.location)) {
          errors.location = 'Unique Location already exists in the file'
        } else {
          uniqueLocation.add(item.location)
        }

        if (!item.pin || !/^\d+$/.test(item.pin) || item.pin.length !== 6) {
          errors.pin = 'PIN should be 6 Numeric long'
        }

        if (
          !item.rating ||
          isNaN(item.rating) ||
          item.rating < 1 ||
          item.rating > 10
        ) {
          errors.rating = 'Rating should be a number between 1 and 10'
        }

        if (
          !item.farm_practice_rating ||
          isNaN(item.farm_practice_rating) ||
          item.farm_practice_rating < 1 ||
          item.farm_practice_rating > 10
        ) {
          errors.farm_practice_rating =
            'Farm practice rating should be a number between 1 and 10'
        }

        if (!item.image_url || !item.image_url.startsWith('https://')) {
          errors.image_url =
            "Invalid image URL format. Must start with 'https://' or Link url"
        }

        if (!item.image_url || !/(jpeg|jpg|png)$/.test(item.image_url)) {
          errors.image_url =
            "Invalid image URL format. Must end with '.jpeg', '.jpg', or '.png'"
        }

        if (
          !item.farm_pdf ||
          !item.farm_pdf.startsWith('https://') ||
          !item.farm_pdf.endsWith('.pdf')
        ) {
          errors.farm_pdf =
            "Farm PDF should start with 'https://' or Link url and ends with '.pdf'"
        }
        if (!item.video_url) {
          errors.video_url = "Video_url should start with 'https://' Link url"
        }

        if (!item.location || !item.location.startsWith('https://')) {
          errors.video_url = "Location should start with 'https://' or Link url"
        }
        if (!item.farm_size || isNaN(item.farm_size.split(' ')[0])) {
          errors.farm_size = 'Farm size is not a number'
        } else if (!item.farm_size.includes('Acres')) {
          errors.farm_size = 'Farm size should be in Acres like 1 Acres'
        }
        if (
          !item.farm_practice_pdf ||
          !item.farm_practice_pdf.startsWith('https://') ||
          !item.farm_practice_pdf.endsWith('.pdf')
        ) {
          errors.farm_practice_pdf =
            "Farm_practice_pdf should start with 'https://' and ends with '.pdf'"
        }
        if (
          !/^[01]+$/.test(item.food_grains) ||
          (item.food_grains && item.food_grains.length !== 1)
        ) {
          errors.food_grains = "Food_grain must be of boolean type  0 or 1";
        }

        if (
          !/^[01]+$/.test(item.vegetables) ||
          (item.vegetables && item.vegetables.length != 1)
        ) {
          errors.vegetables = "vegetables must be of boolean type  0 or 1";
        }

        if (
          !/^[01]+$/.test(item.floriculture) ||
          (item.floriculture && item.floriculture.length != 1)
        ) {
          errors.floriculture = "floriculture must be of boolean type  0 or 1";
        }

        if (
          !/^[01]+$/.test(item.horticulture) ||
          (item.horticulture && item.horticulture.length != 1)
        ) {
          errors.horticulture = "horticulture must be of boolean type 0 or 1";
        }

        if (
          !/^[01]+$/.test(item.exotic_crops) ||
          (item.exotic_crops && item.exotic_crops.length != 1)
        ) {
          errors.exotic_crops = "exotic_crops must be of boolean type  0 or 1";
        }

        // Check for missing fields and add them to the errors object for this item
        const requiredFields = [
          'name',
          'farmer_id',
          'name',
          'address',
          'pin',
          'location',
          'farm_size',
          'farm_pdf',
          'farm_practice_rating',
          'farm_practice_pdf',
          'rating',
          'image_url',
          'video_url',
        ]
        for (const field of requiredFields) {
          if (!item[field]) {
            errors[field] = `Missing '${field}' field`
          }
        }

        // Check if location,farmer_id is not found or already exist in DB
        const farmLocationExist = await Farm.find({
          location: item['location'],
        })
        let farmer
        try {
          farmer = await Farmer.findById(item.farmer_id)
          if (!farmer) {
            errors.farmer_id = 'Farmer not found'
          }
        } catch (err) {
          if (err instanceof mongoose.CastError) {
            errors.farmer_id = 'Invalid farmer ID'
          }
        }

        if (farmLocationExist.length != 0 && farmer == undefined) {
          errors.farmer_id = 'Farmer id is not found'
          errors.location = 'Duplicate farm location'
        } else if (farmLocationExist.length != 0) {
          errors.location = 'Duplicate farm location'
        } else if (farmer == undefined) {
          errors.farmer_id = 'Farmer id is not found '
        }

        if (
          errors.farmer_id ||
          errors.name ||
          errors.address ||
          errors.pin ||
          errors.location ||
          errors.farm_size ||
          errors.farm_pdf ||
          errors.farm_practice_rating ||
          errors.farm_practice_pdf ||
          errors.rating ||
          errors.image_url ||
          errors.video_url ||
          errors.food_grains ||
          errors.vegetables ||
          errors.horticulture ||
          errors.floriculture ||
          errors.exotic_crops
        ) {
          errorLines.push(errors)
        }
      }

      if (errorLines.length >= 1) {
        // There are error some lines missing data
        ;(response.httpStatus = 400), (response.error = errorLines)
      } else {
        // check if the empty file
        if (data.length == 0) {
          response.httpStatus = 400
          response.error = 'Empty File'
        } else {
          // No error
          response.httpStatus = 200
          response.message = 'validation successful'
          response.data = data
        }
      }
    }
  }
  return response
}

exports.stagedFarms = async (req) => {
  // General response format

  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  if (!req.files || !req.files.file) {
    response.error = 'no file selected'
    response.httpStatus = 400
  } else {
    try {
      const file = req.files.file
      //console.log("file Name :- ", file);

      // Check file type
      if (file.mimetype != 'text/csv') {
        response.error = 'select csv file'
        response.httpStatus = 400
      } else {
        const data = await csvToJson(file)
        // Add the file name to each data object

        console.log("data", data);

        // if Same file name do not exist
        const fileExist = await StageFarm.find({ file_name: file.name })

        let updatedData
        if (fileExist.length <= 0) {
          // updatedData = data.map((eachdata) => {
          //   return { ...eachdata, file_name: file.name };
          // });

          updatedData = data.map((eachdata) => {
<<<<<<< HEAD
            return { ...eachdata, file_name: file.name }
          })
=======
            const { exotic_crops, vegetables, food_grains, ...rest } = eachdata;
            return {
              ...rest,
              exotic_crop: exotic_crops,
              vegetable: vegetables,
              food_grain: food_grains,
              file_name: file.name,
            };
          });
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
          // Insert record into DB (stageFarmer)
          const stageFarm = await StageFarm.create(updatedData)

          response.httpStatus = 200
          response.message = 'Insertion succeesful'
          response.data = stageFarm
        } else {
          response.httpStatus = 400
          response.message = 'file name, already exist.'
        }
      }
    } catch (error) {
      response.error = `failed operation ${error}`
      response.httpStatus = 500
    }
  }
  return response
}

exports.getStagedFarms = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }
  try {
    // read the data {stage_status:true}, all the data in stage state
    const stageFarmpending = await StageFarm.find({
      stage_status: true,
      approval_status: false,
    }).select('-createdAt -updatedAt -__v -stage_status -approval_status')
    // Note :- while inserting update the status to approval_status true
    // if approval status true ,stage_staus:true means this data should be
    // inserted into the Agreement table.

    const groupedData = {}
    stageFarmpending.forEach((farm) => {
      if (!groupedData[farm.file_name]) {
        groupedData[farm.file_name] = []
      }
      groupedData[farm.file_name].push(farm)
    })

    const dataArray = Object.entries(groupedData).map(([fileName, farms]) => ({
      name: fileName,
      data: farms,
    }))

    response.httpStatus = 200
    response.data = dataArray.length > 0 ? dataArray : []
  } catch (error) {
    response.error = `operation failed ${error}`
    response.httpStatus = 500
  }
  return response
}

//Change made testing...
exports.createFarm = async (req) => {
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params
  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }

  const data = req.body

  // status setting stage table
  data.map(async (farm) => {
    await StageFarm.updateOne(
      { _id: farm._id },
      { stage_status: false, approval_status: true },
    )
  })

  const updatedData = await Promise.all(
    data.map(async (farm, index) => {
      const {
        name,
        farm_nft_id,
        farmer_id,
        file_name,
        address,
        pin,
        farm_pdf,
        farm_practice_pdf,
        image_url,
        video_url,
        ...rest
<<<<<<< HEAD
      } = farm

      const farmer = await Farmer.findOne({ _id: farm.farmer_id })
      // console.log('farmer', farmer)
      rest.farmer_rating = farmer.rating
      // console.log('rest', rest)
      farm.ipfs_url = ''
=======
      } = farm;
      const farmer = await Farmer.findOne({ _id: farm.farmer_id });
      // console.log('farmer', farmer)

      rest.farmer_rating = farmer.rating;
      console.log("rest", rest);
      farm.ipfs_url = "";
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5

      // -------------- IPFS --------------------
      const options = {
        pinataMetadata: {
          name: farm.farmer_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options)
      farm.ipfs_url = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`
      // -------------- IPFS --------------------
      return { ...farm, user_id: farm.farmer_id }
    }),
  )

  // BlockChain Start
  const mintPromises = []
  const Tran = 'https://mumbai.polygonscan.com/tx'
  for (let index = 0; index < updatedData.length; index++) {
    const farm = updatedData[index]
    farm.farm_nft_id = ''
    // console.log(`ipfs ${index}:`, farm.ipfs_url);
    // BlockChain Start
    const farmerAddr = process.env.FARMER_ADDR //wallet adres

    const gasLimit = await farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .estimateGas({ from: adminAddr })

    const bufferedGasLimit = Math.round(
      Number(gasLimit) + Number(gasLimit) * Number(0.2),
    )

    const encodedData = farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .encodeABI()

    const gasPrice = await web3.eth.getGasPrice()
    const transactionFee =
      parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString())

    const tx = {
      gas: web3.utils.toHex(bufferedGasLimit),
      to: farmNFTAddr,
      value: '0x00',
      data: encodedData,
      from: adminAddr,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key)
    // console.log('signedTx : ', signedTx)

    const transaction = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )
    // console.log("Transaction : ", transaction.transactionHash);
    // console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
    farm.tx_hash = `${Tran}/${transaction.transactionHash}`

    let farm_nft_id = null
    const mintPromise = new Promise((resolve, reject) => {
      // create new promise
      farmNFTContract.getPastEvents(
        'Mint',
        {
          fromBlock: 'latest',
        },
        function (error, events) {
          if (error) {
            reject(error)
          } else {
            const result = events[0].returnValues
            farm_nft_id = result[1]
            // console.log("Farm Id", result[1]);
            farm.farm_nft_id = result[1] // assign farm_nft_id to farm object
            resolve()
          }
        },
      )
    })
    mintPromises.push(mintPromise)
  }
  await Promise.all(mintPromises)
  // BlockChain End

  // Save Farm data in mongoDB , skip id,s.no key in json
  // console.log("updatedData :-", updatedData);
  try {
    const farms = await Farm.create(updatedData, {
      select: `-_id -stage_status -approval_status -file_name`,
    })

    // Removing from staging stable
    updatedData.map(async (farm) => {
      await StageFarm.deleteOne({ _id: farm._id }, { stage_status: false })
    })

    if (farms.length != 0) {
      // console.log("checking if length");

      ;(response.message = 'Data Insertion successful'),
        (response.httpStatus = 200),
        (response.data = updatedData)
    } else {
      // console.log("checking else length");
      ;(response.error = 'Data Insertion failed duplicate data'),
        (response.httpStatus = 500)
    }
  } catch (error) {
    ;(response.error = `Insertion failed ${error}`), (response.httpStatus = 400)
  }

  return response
}

exports.deleteFarm = async (req) => {
  const userLogged = req.user;

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

<<<<<<< HEAD
  const { id } = req.params
=======
  const { id } = req.params;

>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }
  const reason = req.headers["reason"];

<<<<<<< HEAD
  const data = req.body
  const farmer = await Farmer.findOne({ farmer_id: data.farmer_id })

  // status setting stage table
  data.map(async (farm) => {
    await StageFarm.updateOne(
      { _id: farm._id },
      { stage_status: false, approval_status: true },
    )
  })

  const updatedData = await Promise.all(
    data.map(async (farm, index) => {
      const {
        name,
        farmer_id,
        file_name,
        address,
        pin,
        farm_pdf,
        farm_practice_pdf,
        image_url,
        video_url,
        ...rest
      } = farm
      rest.farmer_rating = farmer.rating
      console.log('rest', rest)
      farm.ipfs_url = ''

      // -------------- IPFS --------------------
      const options = {
        pinataMetadata: {
          name: farm.farmer_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options)
      farm.ipfs_url = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`
      // -------------- IPFS --------------------
      return { ...farm, user_id: farm.farmer_id }
    }),
  )

  // BlockChain Start
  const mintPromises = []
  const Tran = 'https://mumbai.polygonscan.com/tx'
  for (let index = 0; index < updatedData.length; index++) {
    const farm = updatedData[index]
    farm.farm_nft_id = ''
    // console.log(`ipfs ${index}:`, farm.ipfs_url);
    // BlockChain Start
    const farmerAddr = process.env.FARMER_ADDR //wallet adres

    const gasLimit = await farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .estimateGas({ from: adminAddr })

    const bufferedGasLimit = Math.round(
      Number(gasLimit) + Number(gasLimit) * Number(0.2),
    )

    const encodedData = farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .encodeABI()

    const gasPrice = await web3.eth.getGasPrice()
    const transactionFee =
      parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString())

    const tx = {
      gas: web3.utils.toHex(bufferedGasLimit),
      to: farmNFTAddr,
      value: '0x00',
      data: encodedData,
      from: adminAddr,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key)
    console.log('signedTx : ', signedTx)

    const transaction = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )
    // console.log("Transaction : ", transaction.transactionHash);
    // console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
    farm.tx_hash = `${Tran}/${transaction.transactionHash}`

    let farm_nft_id = null
    const mintPromise = new Promise((resolve, reject) => {
      // create new promise
      farmNFTContract.getPastEvents(
        'Mint',
        {
          fromBlock: 'latest',
        },
        function (error, events) {
          if (error) {
            reject(error)
          } else {
            const result = events[0].returnValues
            farm_nft_id = result[1]
            // console.log("Farm Id", result[1]);
            farm.farm_nft_id = result[1] // assign farm_nft_id to farm object
            resolve()
          }
        },
      )
    })
    mintPromises.push(mintPromise)
  }
  await Promise.all(mintPromises)
  // BlockChain End

  // Save Farm data in mongoDB , skip id,s.no key in json
  // console.log("updatedData :-", updatedData);
  try {
    const farms = await Farm.create(updatedData, {
      select: `-_id -stage_status -approval_status -file_name`,
    })

    // Removing from staging stable
    updatedData.map(async (farm) => {
      await StageFarm.deleteOne({ _id: farm._id }, { stage_status: false })
    })

    if (farms.length != 0) {
      // console.log("checking if length");

      ;(response.message = 'Data Insertion successful'),
        (response.httpStatus = 200),
        (response.data = updatedData)
    } else {
      // console.log("checking else length");
      ;(response.error = 'Data Insertion failed duplicate data'),
        (response.httpStatus = 500)
    }
  } catch (error) {
    ;(response.error = `Insertion failed ${error}`), (response.httpStatus = 400)
  }

  return response
}

exports.createFarmOld2 = async (req) => {
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params
  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }

  const data = req.body
  // status setting stage table
  data.map(async (farm) => {
    await StageFarm.updateOne(
      { _id: farm._id },
      { stage_status: false, approval_status: true },
    )
  })

  const updatedData = await Promise.all(
    data.map(async (farm, index) => {
      const { _id, farmer_id, file_name, ...rest } = farm
      farm.ipfs_url = ''

      // -------------- IPFS --------------------
      const options = {
        pinataMetadata: {
          name: farm.farmer_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options)
      farm.ipfs_url = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`
      // -------------- IPFS --------------------
      return { ...farm, user_id: farm.farmer_id }
    }),
  )

  // BlockChain Start
  const mintPromises = []
  const Tran = 'https://mumbai.polygonscan.com/tx'
  for (let index = 0; index < updatedData.length; index++) {
    const farm = updatedData[index]
    farm.farm_nft_id = ''
    // console.log(`ipfs ${index}:`, farm.ipfs_url);
    // BlockChain Start
    const farmerAddr = process.env.FARMER_ADDR //wallet adres

    const gasLimit = await farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .estimateGas({ from: adminAddr })

    const bufferedGasLimit = Math.round(
      Number(gasLimit) + Number(gasLimit) * Number(0.2),
    )

    const encodedData = farmNFTContract.methods
      .mint(farmerAddr, `${farm.ipfs_url}`)
      .encodeABI()

    const gasPrice = await web3.eth.getGasPrice()
    const transactionFee =
      parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString())

    const tx = {
      gas: web3.utils.toHex(bufferedGasLimit),
      to: farmNFTAddr,
      value: '0x00',
      data: encodedData,
      from: adminAddr,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key)
    console.log('signedTx : ', signedTx)

    const transaction = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )
    // console.log("Transaction : ", transaction.transactionHash);
    // console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
    farm.tx_hash = `${Tran}/${transaction.transactionHash}`

    let farm_nft_id = null
    const mintPromise = new Promise((resolve, reject) => {
      // create new promise
      farmNFTContract.getPastEvents(
        'Mint',
        {
          fromBlock: 'latest',
        },
        function (error, events) {
          if (error) {
            reject(error)
          } else {
            const result = events[0].returnValues
            farm_nft_id = result[1]
            // console.log("Farm Id", result[1]);
            farm.farm_nft_id = result[1] // assign farm_nft_id to farm object
            resolve()
          }
        },
      )
    })
    mintPromises.push(mintPromise)
  }
  await Promise.all(mintPromises)
  // BlockChain End

  // Save Farm data in mongoDB , skip id,s.no key in json
  // console.log("updatedData :-", updatedData);
  try {
    const farms = await Farm.create(updatedData, {
      select: `-_id -stage_status -approval_status -file_name`,
    })

    // Removing from staging stable
    updatedData.map(async (farm) => {
      await StageFarm.deleteOne({ _id: farm._id }, { stage_status: false })
    })

    if (farms.length != 0) {
      // console.log("checking if length");

      ;(response.message = 'Data Insertion successful'),
        (response.httpStatus = 200),
        (response.data = updatedData)
    } else {
      // console.log("checking else length");
      ;(response.error = 'Data Insertion failed duplicate data'),
        (response.httpStatus = 500)
    }
  } catch (error) {
    ;(response.error = `Insertion failed ${error}`), (response.httpStatus = 400)
  }

  return response
}

exports.deleteFarm = async (req) => {
  const userLogged = req.user

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params

  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }
  const reason = req.headers['reason']

  try {
    // First check farmer is their with id
    let farm = await Farm.findOne({ _id: id }).select(
      '-__v -createdAt -updatedAt',
    )
    if (farm) {
      // delete the farm data..

      // Check if this farm has some agreement
      const agreements = await Agreement.find({ farm_id: farm._id })

      if (agreements.length > 0) {
        // const farmId = agreements[0].farm_id;
        // await Agreement.deleteMany({ farm_id: farmId });
        response.error = `reference exist you can not delete`
        response.httpStatus = 400
      } else {
        console.log('Inside delete else')
        const old_values = 'No change'
        await Farm.deleteOne({ _id: id })
        const new_values = 'No change'

        await Audit.create({
          table_name: 'farm',
          record_id: farm.id,
          change_type: 'delete',
=======
  try {
    // First check farmer is their with id
    let farm = await Farm.findOne({ _id: id }).select(
      "-__v -createdAt -updatedAt"
    );
    if (farm) {
      // delete the farm data..

      // Check if this farm has some agreement
      const agreements = await Agreement.find({ farm_id: farm._id });

      if (agreements.length > 0) {
        // const farmId = agreements[0].farm_id;
        // await Agreement.deleteMany({ farm_id: farmId });
        response.error = `reference exist you can not delete`;
        response.httpStatus = 400;
      } else {
        console.log("Inside delete else");
        const old_values = "No change";
        await Farm.deleteOne({ _id: id });
        const new_values = "No change";

        await Audit.create({
          table_name: "farm",
          record_id: farm.id,
          change_type: "delete",
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
          old_value: old_values,
          new_value: new_values,
          user_id: userLogged.id,
          user_name: userLogged.name,
          change_reason: reason,
<<<<<<< HEAD
        })

        response.message = `Successfully deleted`
        response.httpStatus = 200
      }
    } else {
      response.error = `farm not found`
      response.httpStatus = 404
    }
  } catch (error) {
    response.error = `failed operation ${error}`
    response.httpStatus = 500
  }
  return response
}

exports.updateFarmOld = async (req) => {
  const userLogged = req.user
  const userId = userLogged._id
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params

  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }
  const reason = req.headers['reason']

  const updatedData = req.body

  try {
    //Validation
    const validationRules = {
      farmer_id: { type: 'string' },
      name: { type: 'string', minLength: 3, maxLength: 50 },
      address: { type: 'string', minlegth: 5, maxlength: 200 },
      pin: { type: 'number', minLength: 6, maxLength: 6 },
      farm_nft_id: { type: 'string' },
      rating: { type: 'number' },
      image_url: { type: 'string' },
      video_url: { type: 'string' },
      location: { type: 'string' },
      farm_size: { type: 'string' },
      food_grain: { type: 'boolean' },
      vegetable: { type: 'boolean' },
      horticulture: { type: 'boolean' },
      floriculture: { type: 'boolean' },
      exotic_crop: { type: 'boolean' },
      farm_pdf: { type: 'string' },
      farm_practice_pdf: { type: 'string' },
      farm_practice_rating: { type: 'number' },
    }

    if (typeof updatedData.farmer_id === String) {
      response.error = 'Invalid farmer id'
      response.httpStatus = 400
      return response
    }

    if (
      updatedData.name &&
      (updatedData.name.length < 3 || updatedData.name.length > 50)
    ) {
      response.error =
        'Invalid name: name must be between 3 and 50 characters long'
      response.httpStatus = 400
      return response
    }

    if (
      updatedData.address &&
      (updatedData.address.length < 5 || updatedData.address.length > 200)
    ) {
      response.error =
        'Invalid address: address must be between 5 and 200 characters long'
      response.httpStatus = 400
      return response
    }

    if (updatedData.pin && updatedData.pin.toString().length !== 6) {
      response.error = 'Invalid pin: pin must be 6 digits long'
      response.httpStatus = 400
      return response
    }

    if (typeof farm_nft_id === String) {
      response.error = 'Invalud farm nft id'
      response.httpStatus = 400
      return response
    }
    if (typeof updatedData.rating !== 'number') {
      response.error = 'Invalid rating'
      response.httpStatus = 400
      return response
    }

    if (updatedData.image_url && !validator.isURL(updatedData.image_url)) {
      response.error = 'Invalid image URL: image URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (updatedData.video_url && !validator.isURL(updatedData.video_url)) {
      response.error = 'Invalid video URL: video URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (updatedData.location && !validator.isURL(updatedData.location)) {
      response.error =
        'Invalid location URL: location URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (typeof farm_size !== 'string') {
      response.error = 'Invalid farm size'
      response.httpStatus = 400
      return response
    }

    if (typeof food_grain === Boolean) {
      response.error = 'Invalid food grain'
      response.httpStatus = 400
      return response
    }

    if (typeof vegetable === Boolean) {
      response.error = 'Invalid vegetable'
      response.httpStatus = 400
      return response
    }

    if (typeof horticulture === Boolean) {
      response.error = 'Invalid horticulture'
      response.httpStatus = 400
      return response
    }

    if (typeof floriculture === Boolean) {
      response.error = 'Invalid floriculture'
      response.httpStatus = 400
      return response
    }

    if (typeof exotic_crop === Boolean) {
      response.error = 'Invalid exotic crops'
      response.httpStatus = 400
      return response
    }

    if (updatedData.farm_pdf && !validator.isURL(updatedData.farm_pdf)) {
      response.error =
        'Invalid farm PDF URL: farm PDF URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (
      updatedData.farm_practice_pdf &&
      !validator.isURL(updatedData.farm_practice_pdf)
    ) {
      response.error =
        'Invalid farm practice PDF URL: farm practice PDF URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (typeof updatedData.farm_practice_rating === Number) {
      response.error = 'Invalid farm practice rating'
      response.httpStatus = 400
      return response
    }

    // First check farmer is their with id
    let farm = await Farm.findOne({ _id: id })

    if (farm) {
      // Old farmer
      // const old_values = { ...updatedData.toJSON() };
      // console.log("old_values ", old_values);
      // update the Farm data..
      await Farm.updateOne({ _id: id }, updatedData)
      // const new_values = { ...updatedData.toJSON() };

      const old_values = {}
      const new_values = {}
      for (const key in updatedData) {
        // only log fields that are actually changing
        if (key in farm && farm[key] !== updatedData[key]) {
          old_values[key] = farm[key]
          new_values[key] = updatedData[key]
          farm[key] = updatedData[key]
        }
      }

      //New value contain createdAT and updated, _id
      delete new_values.createdAt
      delete new_values.updatedAt
      delete old_values.createdAt
      delete old_values.updatedAt
      delete old_values._id
      delete new_values._id

      // console.log("new_values ", new_values);
      await Audit.create({
        table_name: 'farm',
        record_id: farm._id,
        change_type: 'update',
        // old_value: JSON.stringify(old_values),
        // new_value: JSON.stringify(new_values),
        old_value: Object.keys(old_values).length
          ? JSON.stringify(old_values)
          : null,
        new_value: Object.keys(new_values).length
          ? JSON.stringify(new_values)
          : null,
        user_id: userId,
        user_name: userLogged.name,
        change_reason: reason,
      })

      const {
        _id,
        farmer_id,
        file_name,
        name,
        address,
        tx_hash,
        farm_nft_id,
        ipfs_url,
        ...rest
      } = farm._doc

      // IPFS----
      const options = {
        pinataMetadata: {
          name: farm.farmer_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options)
      const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`
      farm.ipfs_url = ipfs_hash

      await farm.save()

      const Tran = 'https://mumbai.polygonscan.com/tx'

      //BLOCKCHAIN TRANSACTION-------
      const gasLimit = await farmNFTContract.methods
        .updateFarm(farm.farm_nft_id, ipfs_hash)
        .estimateGas({ from: adminAddr })
      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2),
      )

      const encodedData = farmNFTContract.methods
        .updateFarm(farm.farm_nft_id, ipfs_hash)
        .encodeABI()

      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: farmNFTAddr,
        value: '0x00',
        data: encodedData,
        from: adminAddr,
      }
      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key)
      const transaction = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      )
      console.log('Transaction : ', transaction.transactionHash)
      // console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
      farm.tx_hash = `${Tran}/${transaction.transactionHash}`

      await farm.save()
      response.message = `Successfully updated`
      response.httpStatus = 200
=======
        });

        response.message = `Successfully deleted`;
        response.httpStatus = 200;
      }
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
    } else {
      response.error = `farm not found`
      response.httpStatus = 404
    }
  } catch (error) {
    response.error = `failed operation ${error}`
    response.httpStatus = 500
  }
  return response
}

exports.updateFarm = async (req) => {
  const userLogged = req.user
  const userId = userLogged._id
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  const { id } = req.params

  // Checking Header for password
  const password = req.headers['password']
  const envPassword = process.env.MASTER_PASSWORD // get the password from the environment variable

  if (!password || password != envPassword) {
    response.error = `Invalid password`
    response.httpStatus = 401
    return response
  }
  const reason = req.headers['reason']

  const updatedData = req.body

  try {
    //Validation
    const validationRules = {
      farmer_id: { type: 'string' },
      name: { type: 'string', minLength: 3, maxLength: 50 },
      address: { type: 'string', minlegth: 5, maxlength: 200 },
      pin: { type: 'number', minLength: 6, maxLength: 6 },
      farm_nft_id: { type: 'string' },
      rating: { type: 'number' },
      image_url: { type: 'string' },
      video_url: { type: 'string' },
      location: { type: 'string' },
      farm_size: { type: 'string' },
      food_grain: { type: 'boolean' },
      vegetable: { type: 'boolean' },
      horticulture: { type: 'boolean' },
      floriculture: { type: 'boolean' },
      exotic_crop: { type: 'boolean' },
      farm_pdf: { type: 'string' },
      farm_practice_pdf: { type: 'string' },
      farm_practice_rating: { type: 'number' },
    }

    if (typeof updatedData.farmer_id === String) {
      response.error = 'Invalid farmer id'
      response.httpStatus = 400
      return response
    }

    if (
      updatedData.name &&
      (updatedData.name.length < 3 || updatedData.name.length > 50)
    ) {
      response.error =
        'Invalid name: name must be between 3 and 50 characters long'
      response.httpStatus = 400
      return response
    }

    if (
      updatedData.address &&
      (updatedData.address.length < 5 || updatedData.address.length > 200)
    ) {
      response.error =
        'Invalid address: address must be between 5 and 200 characters long'
      response.httpStatus = 400
      return response
    }

    if (updatedData.pin && updatedData.pin.toString().length !== 6) {
      response.error = 'Invalid pin: pin must be 6 digits long'
      response.httpStatus = 400
      return response
    }

    if (typeof farm_nft_id === String) {
      response.error = 'Invalud farm nft id'
      response.httpStatus = 400
      return response
    }
    if (updatedData.rating < 1 || updatedData.rating > 10) {
      response.error = 'Invalid rating'
      response.httpStatus = 400
      return response
    }

    if (updatedData.image_url && !validator.isURL(updatedData.image_url)) {
      response.error = 'Invalid image URL: image URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (updatedData.video_url && !validator.isURL(updatedData.video_url)) {
      response.error = 'Invalid video URL: video URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (updatedData.location && !validator.isURL(updatedData.location)) {
      response.error =
        'Invalid location URL: location URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (isNaN(updatedData.farm_size.split(' ')[0])) {
      response.error = 'Farm size is not a number'
      response.httpStatus = 400
      return response
    } else if (!updatedData.farm_size.includes('Acres')) {
      response.error = 'Farm size should be in Acres like 1 Acres'
      response.httpStatus = 400
      return response
    }

    if (typeof food_grain === Boolean) {
      response.error = 'Invalid food grain'
      response.httpStatus = 400
      return response
    }

    if (typeof vegetable === Boolean) {
      response.error = 'Invalid vegetable'
      response.httpStatus = 400
      return response
    }

    if (typeof horticulture === Boolean) {
      response.error = 'Invalid horticulture'
      response.httpStatus = 400
      return response
    }

    if (typeof floriculture === Boolean) {
      response.error = 'Invalid floriculture'
      response.httpStatus = 400
      return response
    }

    if (typeof exotic_crop === Boolean) {
      response.error = 'Invalid exotic crops'
      response.httpStatus = 400
      return response
    }

    if (updatedData.farm_pdf && !validator.isURL(updatedData.farm_pdf)) {
      response.error =
        'Invalid farm PDF URL: farm PDF URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (
      updatedData.farm_practice_pdf &&
      !validator.isURL(updatedData.farm_practice_pdf)
    ) {
      response.error =
        'Invalid farm practice PDF URL: farm practice PDF URL must be in a valid format'
      response.httpStatus = 400
      return response
    }

    if (
      updatedData.farm_practice_rating < 1 ||
      updatedData.farm_practice_rating > 10
    ) {
      response.error = 'Invalid farm practice rating'
      response.httpStatus = 400
      return response
    }

    // First check farmer is their with id
    let farm = await Farm.findOne({ _id: id })
    let farmer = await Farmer.findOne({ _id: farm.farmer_id })
    if (farm) {
      // Old farmer
      // const old_values = { ...updatedData.toJSON() };
      // console.log("old_values ", old_values);
      // update the Farm data..
      const updateStatus = await Farm.updateOne({ _id: id }, updatedData)
      console.log('updateStatus 123 : ', updateStatus)
      // const new_values = { ...updatedData.toJSON() };

      const old_values = {}
      const new_values = {}
      for (const key in updatedData) {
        // only log fields that are actually changing
        if (key in farm && farm[key] !== updatedData[key]) {
          old_values[key] = farm[key]
          new_values[key] = updatedData[key]
          farm[key] = updatedData[key]
        }
      }

      //New value contain createdAT and updated, _id
      delete new_values.createdAt
      delete new_values.updatedAt
      delete old_values.createdAt
      delete old_values.updatedAt
      delete old_values._id
      delete new_values._id

      // console.log("new_values ", new_values);
      await Audit.create({
        table_name: 'farm',
        record_id: farm._id,
        change_type: 'update',
        // old_value: JSON.stringify(old_values),
        // new_value: JSON.stringify(new_values),
        old_value: Object.keys(old_values).length
          ? JSON.stringify(old_values)
          : null,
        new_value: Object.keys(new_values).length
          ? JSON.stringify(new_values)
          : null,
        user_id: userId,
        user_name: userLogged.name,
        change_reason: reason,
      })

      const {
        name,
        farmer_id,
        file_name,
        address,
        pin,
        farm_pdf,
        farm_practice_pdf,
        image_url,
        video_url,
        tx_hash,
        ipfs_url,
        createdAt,
        updatedAt,
        __v,
        ...rest
      } = farm._doc

      rest.farmer_rating = farmer.rating

      // IPFS----
      const options = {
        pinataMetadata: {
          name: farm.farmer_id.toString(),
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      const ipfsHash = await pinata.pinJSONToIPFS(rest, options)
      const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`
      farm.ipfs_url = ipfs_hash

      await farm.save()

      const Tran = 'https://mumbai.polygonscan.com/tx'

      //BLOCKCHAIN TRANSACTION-------
      const gasLimit = await farmNFTContract.methods
        .updateFarm(farm.farm_nft_id, ipfs_hash)
        .estimateGas({ from: adminAddr })
      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2),
      )

      const encodedData = farmNFTContract.methods
        .updateFarm(farm.farm_nft_id, ipfs_hash)
        .encodeABI()

      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: farmNFTAddr,
        value: '0x00',
        data: encodedData,
        from: adminAddr,
      }
      const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key)
      const transaction = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      )
      console.log('Transaction : ', transaction.transactionHash)
      // console.log("trx url :", `${Tran}/${transaction.transactionHash}`);
      farm.tx_hash = `${Tran}/${transaction.transactionHash}`

      await farm.save()
      response.message = `Successfully updated`
      response.httpStatus = 200
    } else {
      response.error = `farm not found`
      response.httpStatus = 404
    }
  } catch (error) {
    response.error = `failed operation ${error}`
    response.httpStatus = 500
  }
  return response
}

exports.getFarms = async (req) => {
  const sortOrder = req.query.sortOrder
  const cropTypes = req.query.cropTypes
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }
  const searchQuery = {}

  if (req.query.search) {
    const searchValue = req.query.search
    searchQuery['$or'] = [
      { name: new RegExp(req.query.search, 'i') },
      {
        pin: !isNaN(parseInt(searchValue)) ? parseInt(searchValue) : undefined,
      },
    ]
  }

  try {
    let farmQuery = Farm.find(searchQuery).select('-__v')
    let totalDocuments = await farmQuery.countDocuments(searchQuery)

    // redefine the query before executing it again
    farmQuery = Farm.find(searchQuery)
    if (sortOrder === 'low') {
      farmQuery = farmQuery.sort({ rating: 1 })
    } else if (sortOrder === 'high') {
      farmQuery = farmQuery.sort({ rating: -1 })
    }

    // Apply filtering based on crop types
    if (cropTypes) {
      let cropTypesArray = cropTypes.split(',')
      farmQuery = farmQuery.where('cropTypes').in(cropTypesArray)
    }

    // Apply pagination
    if (page && limit) {
      const skip = (page - 1) * limit
      const totalPages = Math.ceil(totalDocuments / limit)
      const farms = await farmQuery.skip(skip).limit(limit)
      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: farms.map((farm) => ({
          ...farm._doc,
          createdAt: farm.createdAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
          updatedAt: farm.updatedAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
        })),
      }
    } else {
      const farms = await farmQuery

      const farmData = await Promise.all(
        farms.map(async (farm) => {
          // console.log("FARM ID", farm.farmer_id)
          const farmer = await Farmer.findOne({ _id: farm.farmer_id })
          return {
            ...farm._doc,
            farmer_rating: farmer.rating,
            createdAt: farm.createdAt.toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
            }),
            updatedAt: farm.updatedAt.toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
            }),
          }
        }),
      )
      response.data = farmData

      // response.data = farms.map((farm) => ({
      //   ...farm._doc,
      //   rating: farmerRating,
      //   createdAt: farm.createdAt.toLocaleString("en-IN", {
      //     timeZone: "Asia/Kolkata",
      //   }),
      //   updatedAt: farm.updatedAt.toLocaleString("en-IN", {
      //     timeZone: "Asia/Kolkata",
      //   }),
      // }));
    }

    response.httpStatus = 200
  } catch (error) {
    console.log(error)
    response.error = 'failed operation'
    response.httpStatus = 400
  }

  return response
}

exports.createCustomer = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  if (!req.files || !req.files.file) {
    ;(response.error = 'no file selected'), (response.httpStatus = 400)
  }

  try {
    // Read the contents of the file
    const fileContent = req.files.file.data.toString()

    // Parse the JSON data
    const data = JSON.parse(fileContent)

    // Save Farm data in mongoDB , skip id,s.no key in json
    const customers = await User.create(data)
    const prvCustomers = await User.find()

    if (customers.length != 0) {
      console.log('1')
      response.message = 'Data Insertion successful'
      response.httpStatus = 200
      response.data = data
    } else {
      console.log('2')
      ;(response.error = 'Data Insertion failed duplicate data'),
        (response.httpStatus = 500)
    }
  } catch (error) {
    ;(response.error = `Insertion failed ${error}`), (response.httpStatus = 400)
  }

  return response
}

exports.getCustomers = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  let customers
  try {
    customers = await User.find({ is_verified: true }).select('-__v')
    ;(response.data = customers), (response.httpStatus = 200)
  } catch (error) {
    ;(response.error = 'failed operation'), (response.httpStatus = 400)
  }
  return response
}

exports.getAgreementsForAdmin = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  // // Grouping farm... for Admin to show in their active/close Tab
  try {
    const activeContractswithCustomerData = await Agreement.aggregate([
      {
        $match: {
          sold_status: true,
          agreementclose_status: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer_data',
        },
      },
      {
        $group: {
          _id: {
            crop: '$crop',
            start_date: '$start_date',
            end_date: '$end_date',
            price: '$price',
            area: '$area',
            farm_id: '$farm_id',
            customer_id: '$customer_id',
          },
          address: { $first: '$address' },
          farmer_name: { $first: '$farmer_name' },
          agreements: { $push: '$_id' },
          ipfs_url: { $push: '$ipfs_url' },
          tx_hash: { $push: '$tx_hash' },
          agreement_nft_id: { $push: '$agreement_nft_id' },
          unit_bought: { $sum: 1 },
          customer_name: {
            $first: { $arrayElemAt: ['$customer_data.name', 0] },
          },
          customer_email: {
            $first: { $arrayElemAt: ['$customer_data.email', 0] },
          },
          customer_phone: {
            $first: { $arrayElemAt: ['$customer_data.phone', 0] },
          },
          customer_address: {
            $first: { $arrayElemAt: ['$customer_data.address', 0] },
          },
        },
      },
<<<<<<< HEAD
    ])
=======
      {
        $sort: {
          "_id.start_date": 1,
          "_id.crop": 1,
        },
      },
    ]);
>>>>>>> be3c1ed61df5d521c545e5587a1d369cbe7fb9e5
    const closeContractswithCustomerData = await Agreement.aggregate([
      {
        $match: {
          sold_status: true,
          agreementclose_status: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer_data',
        },
      },
      {
        $group: {
          _id: {
            crop: '$crop',
            start_date: '$start_date',
            end_date: '$end_date',
            price: '$price',
            area: '$area',
            farm_id: '$farm_id',
            customer_id: '$customer_id',
          },
          address: { $first: '$address' },
          farmer_name: { $first: '$farmer_name' },
          agreements: { $push: '$_id' },
          ipfs_url: { $push: '$ipfs_url' },
          tx_hash: { $push: '$tx_hash' },
          agreement_nft_id: { $push: '$agreement_nft_id' },
          unit_bought: { $sum: 1 },
          customer_name: {
            $first: { $arrayElemAt: ['$customer_data.name', 0] },
          },
          customer_email: {
            $first: { $arrayElemAt: ['$customer_data.email', 0] },
          },
          customer_phone: {
            $first: { $arrayElemAt: ['$customer_data.phone', 0] },
          },
          customer_address: {
            $first: { $arrayElemAt: ['$customer_data.address', 0] },
          },
        },
      },
    ])

    response.httpStatus = 200
    response.data = {
      active: activeContractswithCustomerData,
      close: closeContractswithCustomerData,
    }
  } catch (error) {
    response.httpStatus = 400
    response.error = 'failed operation'
  }
  return response
}

exports.closeAgreement = async (req) => {
  //console.log("Inside closeAgreement");
  const { id } = req.params // Agreement Id agreement to Update

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  try {
    // Update ageementClose status to true :-
    await Agreement.updateOne({ _id: id }, { agreementclose_status: true })
    let agreementClose = await Agreement.findOne({ _id: id })
    const farm = await Farm.findOne({ farm_id: agreementClose.farm_id })

    const {
      file_name,
      farmer_name,
      address,
      agreement_nft_id,
      tx_hash,
      farm_nft_id,
      price,
      ipfs_url,
      createdAt,
      updatedAt,
      __v,
      ...rest
    } = agreementClose._doc

    rest.farmer_id = farm.farmer_id
    rest.location = farm.location

    // IPFS----
    const options = {
      pinataMetadata: {
        name: agreementClose.farm_nft_id.toString(),
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }

    const ipfsHash = await pinata.pinJSONToIPFS(rest, options)
    const ipfs_hash = `https://ipfs.io/ipfs/${ipfsHash.IpfsHash}`
    agreementClose.ipfs_url = ipfs_hash

    await agreementClose.save()

    // IPFS END------------------------------------

    const Tran = 'https://mumbai.polygonscan.com/tx'

    //Blockchain Transaction ---------------------
    const gasLimit = await marketplaceContract.methods
      .closeContractNFT(agreementClose.agreement_nft_id)
      .estimateGas({ from: adminAddr })

    const bufferedGasLimit = Math.round(
      Number(gasLimit) + Number(gasLimit) * Number(0.2),
    )

    const closeContract = marketplaceContract.methods
      .closeContractNFT(agreementClose.agreement_nft_id)
      .encodeABI()

    const tx = {
      gas: web3.utils.toHex(bufferedGasLimit),
      to: marketplaceAddr,
      value: '0x00',
      data: closeContract,
      from: adminAddr,
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, Private_Key)

    const transaction = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )
    // console.log('Transaction : ', transaction)

    agreementClose.tx_hash = `${Tran}/${transaction.transactionHash}`
    await agreementClose.save()
    //BLOCKCHAIN TRANS END-------------------------------------------

    response.message = 'Agreement closed Successful'
    response.httpStatus = 200
  } catch (error) {
    response.error = `failed operation ${error}`
    response.httpStatus = 200
  }

  return response
}

exports.getdashBoard = async (req) => {
  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: {
      farms: null,
      contracts: null,
      farmers: null,
      customers: null,
    },
  }

  try {
    const farms = await Farm.countDocuments()
    const farmers = await Farmer.countDocuments()
    const customers = await User.countDocuments({ is_verified: true })
    const agreements = await Agreement.countDocuments({ sold_status: false })
    ;(response.httpStatus = 200), (response.data.farmers = farmers)
    response.data.customers = customers
    response.data.farms = farms
    response.data.contracts = agreements
  } catch (error) {
    ;(response.error = 'failed operation'), (response.httpStatus = 500)
  }

  return response
}

exports.getAudit = async (req) => {
  const page = parseInt(req.query.page) || 1 // get the page number or set to 1 by default
  const limit = parseInt(req.query.limit) || 2

  // General response format
  let response = {
    error: null,
    message: null,
    httpStatus: null,
    data: null,
  }

  // Check if params if farmer,farm,agreement
  try {
    if (req.params.table == 'farmer' && page && limit) {
      let auditQuery
      let totalDocuments

      //If search query
      if (req.query.search) {
        auditQuery = Audit.find({
          table_name: 'farmers',
          $or: [
            { user_name: { $regex: req.query.search, $options: 'i' } },
            { change_type: { $regex: req.query.search, $options: 'i' } },
            { record_id: { $regex: req.query.search, $options: 'i' } },
          ],
        }).select('-__v')
        totalDocuments = await Audit.countDocuments(auditQuery)
      } else {
        auditQuery = Audit.find({ table_name: 'farmers' }).select('-__v')
        totalDocuments = await Audit.countDocuments(auditQuery)
      }

      const skip = (page - 1) * limit

      const auditLog = await Audit.find(auditQuery)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .select('-__v -_id -table_name')

      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: auditLog.map((audit) => ({
          ...audit._doc,
          createdAt: audit.createdAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
          updatedAt: audit.updatedAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
        })),
      }
      response.httpStatus = 200
    } else if (req.params.table == 'farm' && page && limit) {
      let auditQuery
      let totalDocuments
      //If search query
      if (req.query.search) {
        auditQuery = Audit.find({
          table_name: 'farm',
          $or: [
            { user_name: { $regex: req.query.search, $options: 'i' } },
            { change_type: { $regex: req.query.search, $options: 'i' } },
            { record_id: { $regex: req.query.search, $options: 'i' } },
          ],
        }).select('-__v -updateAt')
        totalDocuments = await Audit.countDocuments(auditQuery)
      } else {
        auditQuery = Audit.find({ table_name: 'farm' }).select('-__v -updateAt')
        totalDocuments = await Audit.countDocuments(auditQuery)
      }

      const skip = (page - 1) * limit

      const auditLog = await Audit.find(auditQuery)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .select('-__v -_id -table_name')
      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: auditLog.map((audit) => ({
          ...audit._doc,
          createdAt: audit.createdAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
          updatedAt: audit.updatedAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
        })),
      }
      response.httpStatus = 200
    } else if (req.params.table == 'agreement' && page && limit) {
      let auditQuery = Audit.find({ table_name: 'agreement' }).select('-__v')
      let totalDocuments = await Audit.countDocuments(auditQuery)

      const skip = (page - 1) * limit

      const auditLog = await Audit.find(auditQuery)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .select('-__v -_id -table_name')

      response.data = {
        totalPages: Math.ceil(totalDocuments / limit),
        data: auditLog.map((audit) => ({
          ...audit._doc,
          createdAt: audit.createdAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
          updatedAt: audit.updatedAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
        })),
      }
      response.httpStatus = 200
    } else {
      response.message = 'Enter params :- farmer or farm or agreement'
      response.httpStatus = 200
    }
  } catch (error) {
    console.log('ERR', error)
    response.error = 'failed operation'
    response.httpStatus = 500
  }

  return response
}

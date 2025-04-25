import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';

const Test = () => {
    const handleScan = (codes: IDetectedBarcode[]) => {
        if (codes.length > 0) {
            const firstCode = codes[0];
            console.log('Scanned:', firstCode.rawValue);
        }
    };

    const handleError = (err: unknown) => {
        console.error('Scanner error:', err);
    };

    return (
        <>
            Scan
            <div className='w-full h-full flex justify-center items-center'>
                <div className='w-[30%]'>
                    <Scanner
                        onScan={handleScan}
                        onError={handleError}
                        scanDelay={300}
                    />
                </div>
            </div>
        </>
    );
};

export default Test;

<!DOCTYPE html>
<html>

<head>
    <title>Teste</title>
    <meta charset="utf-8" />
    <script type="text/javascript" src="js/brain/brain-gh-pages/brain-0.6.3.js"></script>
</head>

<body>
    <script type="text/javascript">
        

        var data = [{input: [0, 0], output: {a:1}},
                   {input: [0, 1], output: {b:1}},
                   {input: [1, 0], output: {c:1}}];
        
        
        var net = new brain.NeuralNetwork();
        net.train(data);
        var output = net.run([1, 0]); // [0.987]
        console.log(output);
        
        var data2 = net.getData();
        data2.push({input: [1, 1], output: {d:1}});
        var net = new brain.NeuralNetwork();
        net.train(data2);
        var output = net.run([1, 0]); // [0.987]
        console.log(output);
        
        console.log(JSON.stringify(net.toJSON()));
        
    </script>
</body>

</html>